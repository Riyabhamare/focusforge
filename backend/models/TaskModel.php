<?php
/**
 * FocusForge Task Model
 */

require_once __DIR__ . '/../config/database.php';

class TaskModel {
    public static function findAll(int $userId, array $filters = []): array {
        $pdo = Database::getConnection();
        $conditions = ['user_id = ?'];
        $params = [$userId];

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $conditions[] = 'status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['priority']) && $filters['priority'] !== 'all') {
            $conditions[] = 'priority = ?';
            $params[] = $filters['priority'];
        }
        if (!empty($filters['category']) && $filters['category'] !== 'all') {
            $conditions[] = 'category = ?';
            $params[] = $filters['category'];
        }
        if (!empty($filters['search'])) {
            $conditions[] = '(title LIKE ? OR description LIKE ?)';
            $search = '%' . $filters['search'] . '%';
            $params[] = $search;
            $params[] = $search;
        }

        $sortBy = in_array($filters['sortBy'] ?? '', ['due_date', 'priority', 'created_at', 'title']) ? $filters['sortBy'] : 'created_at';
        $sortOrder = strtoupper($filters['sortOrder'] ?? '') === 'ASC' ? 'ASC' : 'DESC';

        $sql = 'SELECT * FROM tasks WHERE ' . implode(' AND ', $conditions) . " ORDER BY {$sortBy} {$sortOrder}";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function findById(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $task = $stmt->fetch();
        return $task ?: null;
    }

    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, estimated_minutes)
            VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)");
        $stmt->execute([
            $data['userId'],
            $data['title'],
            $data['description'] ?? null,
            $data['category'] ?? 'general',
            $data['priority'] ?? 'medium',
            $data['due_date'] ?? null,
            $data['estimated_minutes'] ?? 30
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findById($id, $data['userId']);
    }

    public static function update(int $id, int $userId, array $data): ?array {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];

        $allowed = ['title', 'description', 'category', 'priority', 'status', 'due_date', 'estimated_minutes'];
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
        $sql = 'UPDATE tasks SET ' . implode(', ', $fields) . ' WHERE id = ? AND user_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id, $userId);
    }

    public static function delete(int $id, int $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public static function markCompleted(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("UPDATE tasks SET status = 'completed', completed_at = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$now, $id, $userId]);
        return self::findById($id, $userId);
    }
}
