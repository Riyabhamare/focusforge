<?php
/**
 * FocusForge Badge Model
 */

require_once __DIR__ . '/../config/database.php';

class BadgeModel {
    public static function getAllWithUserStatus(int $userId): array {
        $pdo = Database::getConnection();

        $bStmt = $pdo->prepare('SELECT * FROM badges ORDER BY id ASC');
        $bStmt->execute();
        $allBadges = $bStmt->fetchAll();

        $ubStmt = $pdo->prepare('SELECT badge_id, unlocked_at FROM user_badges WHERE user_id = ?');
        $ubStmt->execute([$userId]);
        $userBadges = $ubStmt->fetchAll();

        $unlockedMap = [];
        foreach ($userBadges as $ub) {
            $unlockedMap[$ub['badge_id']] = $ub['unlocked_at'];
        }

        // Rule evaluators for progress
        $ruleEvaluators = [
            'early_bird' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT COUNT(*) as cnt FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = ? AND hl.completed = 1 AND TIME(hl.created_at) < '09:00:00'");
                $q->execute([$userId]);
                return ['current' => (int)($q->fetch()['cnt'] ?? 0), 'target' => 10];
            },
            'consistent' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?");
                $q->execute([$userId]);
                $s = $q->fetch();
                $max = $s ? max((int)($s['current_streak'] ?? 0), (int)($s['longest_streak'] ?? 0)) : 0;
                return ['current' => $max, 'target' => 30];
            },
            'focus_master' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT SUM(duration_minutes) as mins FROM pomodoro_sessions WHERE user_id = ?");
                $q->execute([$userId]);
                return ['current' => (int)($q->fetch()['mins'] ?? 0), 'target' => 1000];
            },
            'century_club' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT COUNT(*) as cnt FROM tasks WHERE user_id = ? AND status = 'completed'");
                $q->execute([$userId]);
                return ['current' => (int)($q->fetch()['cnt'] ?? 0), 'target' => 100];
            },
            'first_week' => function() use ($pdo, $userId) {
                $q = $pdo->prepare("SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?");
                $q->execute([$userId]);
                $s = $q->fetch();
                $max = $s ? max((int)($s['current_streak'] ?? 0), (int)($s['longest_streak'] ?? 0)) : 0;
                return ['current' => $max, 'target' => 7];
            }
        ];

        $result = [];
        foreach ($allBadges as $b) {
            $key = $b['key'];
            $progress = ['current' => 0, 'target' => 100];
            if (isset($ruleEvaluators[$key])) {
                try {
                    $progress = $ruleEvaluators[$key]();
                } catch (Exception $e) {
                    // Ignore error in progress calculation
                }
            }

            $unlocked = isset($unlockedMap[$b['id']]);

            $result[] = [
                'id'          => (int)$b['id'],
                'key'         => $b['key'],
                'name'        => $b['name'],
                'description' => $b['description'],
                'icon'        => $b['icon'],
                'unlocked'    => $unlocked,
                'unlockedAt'  => $unlocked ? $unlockedMap[$b['id']] : null,
                'progress'    => $unlocked ? ['current' => $progress['target'], 'target' => $progress['target']] : $progress
            ];
        }

        return $result;
    }
}
