<?php
/**
 * FocusForge Goal Controller
 */

require_once __DIR__ . '/../models/GoalModel.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Gamification.php';

class GoalController {
    public static function getGoals(int $userId): void {
        $goals = GoalModel::findAll($userId);
        Response::json([
            'success' => true,
            'goals'   => $goals
        ]);
    }

    public static function getGoalById(int $id, int $userId): void {
        $goal = GoalModel::findById($id, $userId);
        if (!$goal) {
            Response::error('Goal not found', 404);
        }
        Response::json([
            'success' => true,
            'goal'    => $goal
        ]);
    }

    public static function createGoal(int $userId): void {
        $body = Response::getJsonBody();
        $title = trim($body['title'] ?? '');

        if (empty($title)) {
            Response::error('Goal title is required', 400);
        }

        $goal = GoalModel::create([
            'userId'           => $userId,
            'title'            => $title,
            'description'      => $body['description'] ?? null,
            'target_date'      => $body['target_date'] ?? null,
            'status'           => $body['status'] ?? 'in_progress',
            'progress_percent' => isset($body['progress_percent']) ? (int)$body['progress_percent'] : 0
        ]);

        Response::json([
            'success' => true,
            'message' => 'Goal created',
            'goal'    => $goal
        ], 201);
    }

    public static function updateGoal(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $goal = GoalModel::update($id, $userId, $body);
        if (!$goal) {
            Response::error('Goal not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Goal updated',
            'goal'    => $goal
        ]);
    }

    public static function updateProgress(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $percent = isset($body['progress_percent']) ? (int)$body['progress_percent'] : 0;

        $goal = GoalModel::updateProgress($id, $userId, $percent);
        if (!$goal) {
            Response::error('Goal not found', 404);
        }

        $gamification = null;
        if ($goal['status'] === 'completed') {
            $xpResult = Gamification::addXp($userId, 50, "Finished goal: {$goal['title']}");
            $newlyUnlockedBadges = Gamification::checkAndAwardBadges($userId);
            $gamification = [
                'xp'                  => $xpResult,
                'newlyUnlockedBadges' => $newlyUnlockedBadges
            ];
        }

        Response::json([
            'success'      => true,
            'message'      => 'Goal progress updated',
            'goal'         => $goal,
            'gamification' => $gamification
        ]);
    }

    public static function completeGoal(int $id, int $userId): void {
        $goal = GoalModel::markCompleted($id, $userId);
        if (!$goal) {
            Response::error('Goal not found', 404);
        }

        $xpResult = Gamification::addXp($userId, 50, "Finished goal: {$goal['title']}");
        $newlyUnlockedBadges = Gamification::checkAndAwardBadges($userId);

        Response::json([
            'success'      => true,
            'message'      => 'Goal completed',
            'goal'         => $goal,
            'gamification' => [
                'xp'                  => $xpResult,
                'newlyUnlockedBadges' => $newlyUnlockedBadges
            ]
        ]);
    }

    public static function deleteGoal(int $id, int $userId): void {
        $deleted = GoalModel::delete($id, $userId);
        if (!$deleted) {
            Response::error('Goal not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Goal deleted'
        ]);
    }
}
