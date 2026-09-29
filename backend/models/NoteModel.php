<?php
/**
 * FocusForge Note Model
 */

require_once __DIR__ . '/../config/database.php';

class NoteModel {
    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO notes (user_id, title, content_markdown, linked_task_id, linked_goal_id, tags)
            VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['userId'],
            $data['title'],
            $data['content_markdown'] ?? '',
            !empty($data['linked_task_id']) ? (int)$data['linked_task_id'] : null,
            !empty($data['linked_goal_id']) ? (int)$data['linked_goal_id'] : null,
            $data['tags'] ?? ''
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findById($id, $data['userId']);
    }

    public static function findById(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $note = $stmt->fetch();
        return $note ?: null;
    }

    public static function findAll(int $userId, array $filters = []): array {
        $pdo = Database::getConnection();
        $conditions = ['user_id = ?'];
        $params = [$userId];

        if (!empty($filters['tag'])) {
            $conditions[] = 'tags LIKE ?';
            $params[] = '%' . $filters['tag'] . '%';
        }
        if (!empty($filters['linked_task_id'])) {
            $conditions[] = 'linked_task_id = ?';
            $params[] = (int)$filters['linked_task_id'];
        }
        if (!empty($filters['linked_goal_id'])) {
            $conditions[] = 'linked_goal_id = ?';
            $params[] = (int)$filters['linked_goal_id'];
        }
        if (!empty($filters['search'])) {
            $conditions[] = '(title LIKE ? OR content_markdown LIKE ?)';
            $search = '%' . $filters['search'] . '%';
            $params[] = $search;
            $params[] = $search;
        }

        $sql = 'SELECT * FROM notes WHERE ' . implode(' AND ', $conditions) . ' ORDER BY updated_at DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function update(int $id, int $userId, array $data): ?array {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];

        $allowed = ['title', 'content_markdown', 'linked_task_id', 'linked_goal_id', 'tags'];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $fields[] = "{$col} = ?";
                $params[] = $data[$col];
            }
        }

        if (empty($fields)) {
            return self::findById($id, $userId);
        }

        $fields[] = 'updated_at = NOW()';
        $params[] = $id;
        $params[] = $userId;
        $sql = 'UPDATE notes SET ' . implode(', ', $fields) . ' WHERE id = ? AND user_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id, $userId);
    }

    public static function delete(int $id, int $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }
}
