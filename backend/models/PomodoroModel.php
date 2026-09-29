<?php
/**
 * FocusForge Pomodoro Model
 */

require_once __DIR__ . '/../config/database.php';

class PomodoroModel {
    public static function logSession(array $data): array {
        $pdo = Database::getConnection();
        $startTime = $data['started_at'] ?? date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("INSERT INTO pomodoro_sessions (user_id, started_at, duration_minutes, task_id)
            VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['userId'],
            $startTime,
            (int)($data['duration_minutes'] ?? 25),
            !empty($data['task_id']) ? (int)$data['task_id'] : null
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findById($id, $data['userId']);
    }

    public static function findById(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT ps.*, t.title as task_title FROM pomodoro_sessions ps
            LEFT JOIN tasks t ON ps.task_id = t.id
            WHERE ps.id = ? AND ps.user_id = ?");
        $stmt->execute([$id, $userId]);
        $session = $stmt->fetch();
        return $session ?: null;
    }

    public static function getHistory(int $userId, int $limit = 50): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT ps.*, t.title as task_title FROM pomodoro_sessions ps
            LEFT JOIN tasks t ON ps.task_id = t.id
            WHERE ps.user_id = ?
            ORDER BY ps.started_at DESC LIMIT ?");
        $stmt->bindValue(1, $userId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
