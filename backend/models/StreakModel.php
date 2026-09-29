<?php
/**
 * FocusForge Streak Model
 */

require_once __DIR__ . '/../config/database.php';

class StreakModel {
    public static function getByUserId(int $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM streaks WHERE user_id = ?');
        $stmt->execute([$userId]);
        $streak = $stmt->fetch();

        if (!$streak) {
            $ins = $pdo->prepare('INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES (?, 0, 0, NULL)');
            $ins->execute([$userId]);
            $stmt->execute([$userId]);
            $streak = $stmt->fetch();
        }

        $actStmt = $pdo->prepare('SELECT date, activity_points, intensity_bucket FROM daily_activity WHERE user_id = ? ORDER BY date DESC LIMIT 30');
        $actStmt->execute([$userId]);
        $recentActivity = $actStmt->fetchAll();

        return [
            'current_streak'   => (int)($streak['current_streak'] ?? 0),
            'longest_streak'   => (int)($streak['longest_streak'] ?? 0),
            'last_active_date' => $streak['last_active_date'] ?? null,
            'recentActivity'   => $recentActivity
        ];
    }
}
