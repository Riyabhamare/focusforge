<?php
/**
 * FocusForge Pomodoro Controller
 */

require_once __DIR__ . '/../models/PomodoroModel.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Gamification.php';

class PomodoroController {
    public static function logSession(int $userId): void {
        $body = Response::getJsonBody();
        $durationMinutes = isset($body['duration_minutes']) ? (int)$body['duration_minutes'] : 25;
        $taskId = !empty($body['task_id']) ? (int)$body['task_id'] : null;
        $startedAt = $body['started_at'] ?? date('Y-m-d H:i:s');

        $session = PomodoroModel::logSession([
            'userId'           => $userId,
            'duration_minutes' => $durationMinutes,
            'task_id'          => $taskId,
            'started_at'       => $startedAt
        ]);

        $dateStr = explode(' ', $startedAt)[0];
        $streakResult = Gamification::updateStreak($userId, $dateStr);
        Gamification::updateDailyActivity($userId, $dateStr);
        $newlyUnlockedBadges = Gamification::checkAndAwardBadges($userId);

        Response::json([
            'success'      => true,
            'message'      => 'Pomodoro session logged',
            'session'      => $session,
            'gamification' => [
                'streak'              => $streakResult,
                'newlyUnlockedBadges' => $newlyUnlockedBadges
            ]
        ], 201);
    }

    public static function getHistory(int $userId): void {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $history = PomodoroModel::getHistory($userId, $limit);
        Response::json([
            'success' => true,
            'history' => $history
        ]);
    }
}
