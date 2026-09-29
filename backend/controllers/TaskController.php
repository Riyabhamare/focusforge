<?php
/**
 * FocusForge Task Controller
 */

require_once __DIR__ . '/../models/TaskModel.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Gamification.php';

class TaskController {
    public static function getTasks(int $userId): void {
        $filters = [
            'status'    => $_GET['status'] ?? null,
            'priority'  => $_GET['priority'] ?? null,
            'category'  => $_GET['category'] ?? null,
            'search'    => $_GET['search'] ?? null,
            'sortBy'    => $_GET['sortBy'] ?? null,
            'sortOrder' => $_GET['sortOrder'] ?? null,
        ];
        $tasks = TaskModel::findAll($userId, $filters);
        Response::json([
            'success' => true,
            'tasks'   => $tasks
        ]);
    }

    public static function getTaskById(int $id, int $userId): void {
        $task = TaskModel::findById($id, $userId);
        if (!$task) {
            Response::error('Task not found', 404);
        }
        Response::json([
            'success' => true,
            'task'    => $task
        ]);
    }

    public static function createTask(int $userId): void {
        $body = Response::getJsonBody();
        $title = trim($body['title'] ?? '');

        if (empty($title)) {
            Response::error('Task title is required', 400);
        }

        $task = TaskModel::create([
            'userId'            => $userId,
            'title'             => $title,
            'description'       => $body['description'] ?? null,
            'category'          => $body['category'] ?? 'general',
            'priority'          => $body['priority'] ?? 'medium',
            'due_date'          => $body['due_date'] ?? null,
            'estimated_minutes' => isset($body['estimated_minutes']) ? (int)$body['estimated_minutes'] : 30
        ]);

        Response::json([
            'success' => true,
            'message' => 'Task created',
            'task'    => $task
        ], 201);
    }

    public static function updateTask(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $task = TaskModel::update($id, $userId, $body);
        if (!$task) {
            Response::error('Task not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Task updated',
            'task'    => $task
        ]);
    }

    public static function deleteTask(int $id, int $userId): void {
        $deleted = TaskModel::delete($id, $userId);
        if (!$deleted) {
            Response::error('Task not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }

    public static function completeTask(int $id, int $userId): void {
        $task = TaskModel::markCompleted($id, $userId);
        if (!$task) {
            Response::error('Task not found', 404);
        }

        $today = date('Y-m-d');
        $xpResult = Gamification::addXp($userId, 10, "Completed task: {$task['title']}");
        $streakResult = Gamification::updateStreak($userId, $today);
        Gamification::updateDailyActivity($userId, $today);
        $newlyUnlockedBadges = Gamification::checkAndAwardBadges($userId);

        Response::json([
            'success'      => true,
            'message'      => 'Task completed',
            'task'         => $task,
            'gamification' => [
                'xp'                  => $xpResult,
                'streak'              => $streakResult,
                'newlyUnlockedBadges' => $newlyUnlockedBadges
            ]
        ]);
    }
}
