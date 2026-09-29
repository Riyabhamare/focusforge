<?php
/**
 * FocusForge Gamification Engine
 * Handles XP rewards, levels, streaks, activity points, and badge rules
 */

require_once __DIR__ . '/../config/database.php';

class Gamification {
    public static function calculateLevel(int $xp): int {
        if ($xp <= 0) return 1;
        return (int)floor(1 + sqrt($xp / 250));
    }

    public static function addXp(int $userId, int $amount, string $reason): array {
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT xp, level FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user) {
            return ['xpGained' => 0, 'newTotalXp' => 0, 'newLevel' => 1, 'leveledUp' => false];
        }

        $currentXp = (int)($user['xp'] ?? 0);
        $currentLevel = (int)($user['level'] ?? 1);
        $newTotalXp = $currentXp + $amount;
        $newLevel = self::calculateLevel($newTotalXp);
        $leveledUp = $newLevel > $currentLevel;

        // Log XP event
        $logStmt = $pdo->prepare('INSERT INTO xp_log (user_id, amount, reason) VALUES (?, ?, ?)');
        $logStmt->execute([$userId, $amount, $reason]);

        // Update user
        $upStmt = $pdo->prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?');
        $upStmt->execute([$newTotalXp, $newLevel, $userId]);

        return [
            'xpGained'   => $amount,
            'newTotalXp' => $newTotalXp,
            'newLevel'   => $newLevel,
            'leveledUp'  => $leveledUp
        ];
    }

    public static function updateStreak(int $userId, ?string $dateStr = null): array {
        $today = $dateStr ?: date('Y-m-d');
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare('SELECT * FROM streaks WHERE user_id = ?');
        $stmt->execute([$userId]);
        $streak = $stmt->fetch();

        if (!$streak) {
            $ins = $pdo->prepare('INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES (?, 1, 1, ?)');
            $ins->execute([$userId, $today]);
            return ['current_streak' => 1, 'longest_streak' => 1, 'last_active_date' => $today];
        }

        $lastActive = $streak['last_active_date'];
        if ($lastActive === $today) {
            return [
                'current_streak'   => (int)$streak['current_streak'],
                'longest_streak'   => (int)$streak['longest_streak'],
                'last_active_date' => $today
            ];
        }

        $currentStreak = (int)$streak['current_streak'];
        $longestStreak = (int)$streak['longest_streak'];

        if ($lastActive) {
            $d1 = new DateTime($lastActive);
            $d2 = new DateTime($today);
            $diffDays = (int)$d1->diff($d2)->days;

            if ($diffDays === 1) {
                $currentStreak += 1;
            } elseif ($diffDays > 1) {
                $currentStreak = 1;
            }
        } else {
            $currentStreak = 1;
        }

        if ($currentStreak > $longestStreak) {
            $longestStreak = $currentStreak;
        }

        $up = $pdo->prepare('UPDATE streaks SET current_streak = ?, longest_streak = ?, last_active_date = ? WHERE user_id = ?');
        $up->execute([$currentStreak, $longestStreak, $today, $userId]);

        return [
            'current_streak'   => $currentStreak,
            'longest_streak'   => $longestStreak,
            'last_active_date' => $today
        ];
    }

    public static function updateDailyActivity(int $userId, ?string $dateStr = null): array {
        $date = $dateStr ?: date('Y-m-d');
        $pdo = Database::getConnection();

        // 1. Completed tasks on date
        $tStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM tasks WHERE user_id = ? AND status = 'completed' AND DATE(completed_at) = ?");
        $tStmt->execute([$userId, $date]);
        $completedTasks = (int)($tStmt->fetch()['cnt'] ?? 0);

        // 2. Completed habits on date
        $hStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = ? AND hl.date = ? AND hl.completed = 1");
        $hStmt->execute([$userId, $date]);
        $completedHabits = (int)($hStmt->fetch()['cnt'] ?? 0);

        // 3. Focus minutes on date
        $pStmt = $pdo->prepare("SELECT SUM(duration_minutes) as mins FROM pomodoro_sessions WHERE user_id = ? AND DATE(started_at) = ?");
        $pStmt->execute([$userId, $date]);
        $focusMinutes = (int)($pStmt->fetch()['mins'] ?? 0);

        $activityPoints = ($completedTasks * 10) + ($completedHabits * 15) + ($focusMinutes * 1);

        $intensityBucket = 0;
        if ($activityPoints > 0 && $activityPoints <= 25) $intensityBucket = 1;
        elseif ($activityPoints > 25 && $activityPoints <= 50) $intensityBucket = 2;
        elseif ($activityPoints > 50 && $activityPoints <= 75) $intensityBucket = 3;
        elseif ($activityPoints > 75) $intensityBucket = 4;

        $upsert = $pdo->prepare("INSERT INTO daily_activity (user_id, date, activity_points, intensity_bucket)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE activity_points = VALUES(activity_points), intensity_bucket = VALUES(intensity_bucket)");
        $upsert->execute([$userId, $date, $activityPoints, $intensityBucket]);

        return ['date' => $date, 'activityPoints' => $activityPoints, 'intensityBucket' => $intensityBucket];
    }

    public static function checkAndAwardBadges(int $userId): array {
        $pdo = Database::getConnection();
        $newlyUnlocked = [];

        // Check existing user badges
        $stmt = $pdo->prepare("SELECT b.key FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = ?");
        $stmt->execute([$userId]);
        $unlockedKeys = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $unlockedSet = array_flip($unlockedKeys);

        $rules = [
            'early_bird' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT COUNT(*) as cnt FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = ? AND hl.completed = 1 AND TIME(hl.created_at) < '09:00:00'");
                $q->execute([$userId]);
                return (int)($q->fetch()['cnt'] ?? 0) >= 10;
            },
            'consistent' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?");
                $q->execute([$userId]);
                $s = $q->fetch();
                $max = $s ? max((int)($s['current_streak'] ?? 0), (int)($s['longest_streak'] ?? 0)) : 0;
                return $max >= 30;
            },
            'focus_master' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT SUM(duration_minutes) as mins FROM pomodoro_sessions WHERE user_id = ?");
                $q->execute([$userId]);
                return (int)($q->fetch()['mins'] ?? 0) >= 1000;
            },
            'century_club' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT COUNT(*) as cnt FROM tasks WHERE user_id = ? AND status = 'completed'");
                $q->execute([$userId]);
                return (int)($q->fetch()['cnt'] ?? 0) >= 100;
            },
            'first_week' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?");
                $q->execute([$userId]);
                $s = $q->fetch();
                $max = $s ? max((int)($s['current_streak'] ?? 0), (int)($s['longest_streak'] ?? 0)) : 0;
                return $max >= 7;
            }
        ];

        foreach ($rules as $key => $checkFn) {
            if (isset($unlockedSet[$key])) continue;

            if ($checkFn()) {
                $bStmt = $pdo->prepare("SELECT id, `key`, name, description, icon FROM badges WHERE `key` = ?");
                $bStmt->execute([$key]);
                $badgeDef = $bStmt->fetch();
                if ($badgeDef) {
                    $ins = $pdo->prepare("INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)");
                    $ins->execute([$userId, $badgeDef['id']]);
                    $newlyUnlocked[] = $badgeDef;
                }
            }
        }

        return $newlyUnlocked;
    }
}
