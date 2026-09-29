<?php
/**
 * FocusForge Goal Model
 */

require_once __DIR__ . '/../config/database.php';

class GoalModel {
    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO goals (user_id, title, description, target_date, status, progress_percent)
            VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['userId'],
            $data['title'],
            $data['description'] ?? null,
            $data['target_date'] ?? null,
            $data['status'] ?? 'in_progress',
            $data['progress_percent'] ?? 0
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findById($id, $data['userId']);
    }

    public static function findById(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $goal = $stmt->fetch();
        return $goal ?: null;
    }

    public static function findAll(int $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function update(int $id, int $userId, array $data): ?array {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];

        $allowed = ['title', 'description', 'target_date', 'status', 'progress_percent'];
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
        $sql = 'UPDATE goals SET ' . implode(', ', $fields) . ' WHERE id = ? AND user_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id, $userId);
    }

    public static function updateProgress(int $id, int $userId, int $progressPercent): ?array {
        $pdo = Database::getConnection();
        $status = $progressPercent >= 100 ? 'completed' : 'in_progress';
        $stmt = $pdo->prepare('UPDATE goals SET progress_percent = ?, status = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([$progressPercent, $status, $id, userId]);
        return self::findById($id, $userId);
    }

    public static function markCompleted(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE goals SET status = 'completed', progress_percent = 100 WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        return self::findById($id, $userId);
    }

    public static function delete(int $id, int $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM goals WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }
}
