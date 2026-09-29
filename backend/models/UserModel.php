<?php
/**
 * FocusForge User Model
 */

require_once __DIR__ . '/../config/database.php';

class UserModel {
    public static function findById(int $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT id, name, email, avatar, xp, level, created_at, updated_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function findByEmail(string $email): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function create(string $name, string $email, string $passwordHash, string $avatar = 'warrior'): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, avatar, xp, level) VALUES (?, ?, ?, ?, 0, 1)');
        $stmt->execute([$name, $email, $passwordHash, $avatar]);
        $id = (int)$pdo->lastInsertId();

        // Create initial streak row
        $today = date('Y-m-d');
        $stStmt = $pdo->prepare('INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES (?, 1, 1, ?)');
        $stStmt->execute([$id, $today]);

        return self::findById($id);
    }

    public static function updateSettings(int $id, ?string $name = null, ?string $avatar = null): ?array {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];

        if ($name !== null && trim($name) !== '') {
            $fields[] = 'name = ?';
            $params[] = trim($name);
        }
        if ($avatar !== null && trim($avatar) !== '') {
            $fields[] = 'avatar = ?';
            $params[] = trim($avatar);
        }

        if (!empty($fields)) {
            $params[] = $id;
            $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        return self::findById($id);
    }

    public static function getXpHistory(int $userId, int $limit = 50): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT id, amount, reason, created_at FROM xp_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?');
        $stmt->bindValue(1, $userId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getStatsSummary(int $userId): array {
        $pdo = Database::getConnection();

        $tStmt = $pdo->prepare("SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
            FROM tasks WHERE user_id = ?");
        $tStmt->execute([$userId]);
        $tasks = $tStmt->fetch();

        $hStmt = $pdo->prepare("SELECT COUNT(*) as total_habits FROM habits WHERE user_id = ?");
        $hStmt->execute([$userId]);
        $habits = $hStmt->fetch();

        $sStmt = $pdo->prepare("SELECT current_streak, longest_streak, last_active_date FROM streaks WHERE user_id = ?");
        $sStmt->execute([$userId]);
        $streak = $sStmt->fetch();

        $pStmt = $pdo->prepare("SELECT SUM(duration_minutes) as total_focus_minutes FROM pomodoro_sessions WHERE user_id = ?");
        $pStmt->execute([$userId]);
        $pomodoro = $pStmt->fetch();

        $user = self::findById($userId);

        return [
            'user' => $user,
            'tasks' => [
                'total'     => (int)($tasks['total_tasks'] ?? 0),
                'completed' => (int)($tasks['completed_tasks'] ?? 0),
                'pending'   => (int)($tasks['pending_tasks'] ?? 0),
            ],
            'habits' => [
                'total' => (int)($habits['total_habits'] ?? 0),
            ],
            'streak' => [
                'current'        => (int)($streak['current_streak'] ?? 0),
                'longest'        => (int)($streak['longest_streak'] ?? 0),
                'lastActiveDate' => $streak['last_active_date'] ?? null,
            ],
            'focusMinutes' => (int)($pomodoro['total_focus_minutes'] ?? 0)
        ];
    }
}
