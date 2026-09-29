<?php
/**
 * FocusForge Timetable Model
 */

require_once __DIR__ . '/../config/database.php';

class TimetableModel {
    public static function getWeek(int $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM timetable_blocks WHERE user_id = ? ORDER BY day_of_week ASC, start_time ASC');
        $stmt->execute([$userId]);
        $blocks = $stmt->fetchAll();

        $week = [0 => [], 1 => [], 2 => [], 3 => [], 4 => [], 5 => [], 6 => []];
        foreach ($blocks as $b) {
            $dow = (int)$b['day_of_week'];
            if (isset($week[$dow])) {
                $week[$dow][] = $b;
            }
        }
        return $week;
    }

    public static function findById(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM timetable_blocks WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $block = $stmt->fetch();
        return $block ?: null;
    }

    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO timetable_blocks (user_id, day_of_week, start_time, end_time, category, color, title)
            VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['userId'],
            (int)$data['day_of_week'],
            $data['start_time'],
            $data['end_time'],
            $data['category'] ?? 'study',
            $data['color'] ?? '#4F46E5',
            $data['title']
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findById($id, $data['userId']);
    }

    public static function update(int $id, int $userId, array $data): ?array {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];

        $allowed = ['day_of_week', 'start_time', 'end_time', 'category', 'color', 'title'];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $fields[] = "{$col} = ?";
                $params[] = ($col === 'day_of_week') ? (int)$data[$col] : $data[$col];
            }
        }

        if (empty($fields)) {
            return self::findById($id, $userId);
        }

        $params[] = $id;
        $params[] = $userId;
        $sql = 'UPDATE timetable_blocks SET ' . implode(', ', $fields) . ' WHERE id = ? AND user_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id, $userId);
    }

    public static function delete(int $id, int $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM timetable_blocks WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }
}
