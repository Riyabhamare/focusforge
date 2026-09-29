<?php
/**
 * FocusForge Habit Controller
 */

require_once __DIR__ . '/../models/HabitModel.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Gamification.php';

class HabitController {
    public static function getHabits(int $userId): void {
        $habits = HabitModel::findAll($userId);
        Response::json([
            'success' => true,
            'habits'  => $habits
        ]);
    }

    public static function getHabitById(int $id, int $userId): void {
        $habit = HabitModel::findById($id, $userId);
        if (!$habit) {
            Response::error('Habit not found', 404);
        }
        Response::json([
            'success' => true,
            'habit'   => $habit
        ]);
    }

    public static function createHabit(int $userId): void {
        $body = Response::getJsonBody();
        $title = trim($body['title'] ?? '');

        if (empty($title)) {
            Response::error('Habit title is required', 400);
        }

        $habit = HabitModel::create([
            'userId'       => $userId,
            'title'        => $title,
            'category'     => $body['category'] ?? 'health',
            'frequency'    => $body['frequency'] ?? 'daily',
            'target_count' => isset($body['target_count']) ? (int)$body['target_count'] : 1
        ]);

        Response::json([
            'success' => true,
            'message' => 'Habit created',
            'habit'   => $habit
        ], 201);
    }

    public static function updateHabit(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $habit = HabitModel::update($id, $userId, $body);
        if (!$habit) {
            Response::error('Habit not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Habit updated',
            'habit'   => $habit
        ]);
    }

    public static function deleteHabit(int $id, int $userId): void {
        $deleted = HabitModel::delete($id, $userId);
        if (!$deleted) {
            Response::error('Habit not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Habit deleted'
        ]);
    }

    public static function logCompletion(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $dateStr = $body['date'] ?? date('Y-m-d');
        $completed = isset($body['completed']) ? (int)$body['completed'] : 1;

        try {
            $log = HabitModel::logCompletion($id, $userId, $dateStr, $completed);
            $habit = HabitModel::findById($id, $userId);

            $gamification = null;
            if ($completed) {
                $xpResult = Gamification::addXp($userId, 25, "Completed habit: {$habit['title']}");
                $streakResult = Gamification::updateStreak($userId, $dateStr);
                Gamification::updateDailyActivity($userId, $dateStr);
                $newlyUnlockedBadges = Gamification::checkAndAwardBadges($userId);

                $gamification = [
                    'xp'                  => $xpResult,
                    'streak'              => $streakResult,
                    'newlyUnlockedBadges' => $newlyUnlockedBadges
                ];
            }

            Response::json([
                'success'      => true,
                'message'      => $completed ? 'Habit logged as completed' : 'Habit logged as incomplete',
                'log'          => $log,
                'gamification' => $gamification
            ]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
