<?php
/**
 * FocusForge Habit Model
 */

require_once __DIR__ . '/../config/database.php';

class HabitModel {
    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO habits (user_id, title, category, frequency, target_count) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['userId'],
            $data['title'],
            $data['category'] ?? 'health',
            $data['frequency'] ?? 'daily',
            $data['target_count'] ?? 1
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findById($id, $data['userId']);
    }

    public static function findById(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM habits WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $habit = $stmt->fetch();
        if (!$habit) return null;

        $logStmt = $pdo->prepare('SELECT id, date, completed, created_at FROM habit_logs WHERE habit_id = ? ORDER BY date DESC LIMIT 30');
        $logStmt->execute([$id]);
        $habit['logs'] = $logStmt->fetchAll();
        return $habit;
    }

    public static function findAll(int $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([$userId]);
        $habits = $stmt->fetchAll();

        $logStmt = $pdo->prepare('SELECT id, date, completed, created_at FROM habit_logs WHERE habit_id = ? ORDER BY date DESC LIMIT 30');
        foreach ($habits as &$habit) {
            $logStmt->execute([$habit['id']]);
            $habit['logs'] = $logStmt->fetchAll();
        }

        return $habits;
    }

    public static function update(int $id, int $userId, array $data): ?array {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];

        $allowed = ['title', 'category', 'frequency', 'target_count'];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $fields[] = "{$col} = ?";
                $params[] = $data[$col];
            }
        }

        if (empty($fields)) {
            return self::findById($id, $userId);
        }

        $params[] = $id;
        $params[] = $userId;
        $sql = 'UPDATE habits SET ' . implode(', ', $fields) . ' WHERE id = ? AND user_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id, $userId);
    }

    public static function delete(int $id, int $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM habits WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public static function logCompletion(int $habitId, int $userId, ?string $dateStr = null, int $completed = 1): ?array {
        $pdo = Database::getConnection();
        $hStmt = $pdo->prepare('SELECT id FROM habits WHERE id = ? AND user_id = ?');
        $hStmt->execute([$habitId, $userId]);
        if (!$hStmt->fetch()) {
            throw new Exception('Habit not found');
        }

        $date = $dateStr ?: date('Y-m-d');
        $upsert = $pdo->prepare("INSERT INTO habit_logs (habit_id, date, completed) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE completed = VALUES(completed)");
        $upsert->execute([$habitId, $date, $completed ? 1 : 0]);

        $resStmt = $pdo->prepare('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?');
        $resStmt->execute([$habitId, $date]);
        return $resStmt->fetch() ?: null;
    }
}
