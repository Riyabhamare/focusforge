<?php
/**
 * FocusForge Timetable Controller
 */

require_once __DIR__ . '/../models/TimetableModel.php';
require_once __DIR__ . '/../utils/Response.php';

class TimetableController {
    public static function getWeek(int $userId): void {
        $week = TimetableModel::getWeek($userId);
        Response::json([
            'success' => true,
            'week'    => $week
        ]);
    }

    public static function createBlock(int $userId): void {
        $body = Response::getJsonBody();
        $title = trim($body['title'] ?? '');

        if (empty($title)) {
            Response::error('Title is required', 400);
        }

        $block = TimetableModel::create([
            'userId'      => $userId,
            'day_of_week' => isset($body['day_of_week']) ? (int)$body['day_of_week'] : 0,
            'start_time'  => $body['start_time'] ?? '09:00',
            'end_time'    => $body['end_time'] ?? '10:00',
            'category'    => $body['category'] ?? 'study',
            'color'       => $body['color'] ?? '#4F46E5',
            'title'       => $title
        ]);

        Response::json([
            'success' => true,
            'message' => 'Timetable block created',
            'block'   => $block
        ], 201);
    }

    public static function updateBlock(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $block = TimetableModel::update($id, $userId, $body);
        if (!$block) {
            Response::error('Timetable block not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Timetable block updated',
            'block'   => $block
        ]);
    }

    public static function deleteBlock(int $id, int $userId): void {
        $deleted = TimetableModel::delete($id, $userId);
        if (!$deleted) {
            Response::error('Timetable block not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Timetable block deleted'
        ]);
    }
}
