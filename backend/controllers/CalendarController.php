<?php
/**
 * FocusForge Calendar Controller
 */

require_once __DIR__ . '/../models/CalendarModel.php';
require_once __DIR__ . '/../utils/Response.php';

class CalendarController {
    public static function getMonthView(int $userId): void {
        $now = new DateTime();
        $year = isset($_GET['year']) ? (int)$_GET['year'] : (int)$now->format('Y');
        $month = isset($_GET['month']) ? (int)$_GET['month'] : (int)$now->format('m');

        $monthView = CalendarModel::getMonthView($userId, $year, $month);
        Response::json(array_merge(['success' => true], $monthView));
    }

    public static function getEvents(int $userId): void {
        $events = CalendarModel::findAllEvents($userId);
        Response::json([
            'success' => true,
            'events'  => $events
        ]);
    }

    public static function createEvent(int $userId): void {
        $body = Response::getJsonBody();
        $title = trim($body['title'] ?? '');
        $date = trim($body['date'] ?? '');

        if (empty($title) || empty($date)) {
            Response::error('Title and date are required', 400);
        }

        $event = CalendarModel::createEvent([
            'userId' => $userId,
            'title'  => $title,
            'date'   => $date,
            'time'   => $body['time'] ?? null,
            'type'   => $body['type'] ?? 'event',
            'ref_id' => $body['ref_id'] ?? null
        ]);

        Response::json([
            'success' => true,
            'message' => 'Calendar event created',
            'event'   => $event
        ], 201);
    }

    public static function updateEvent(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $event = CalendarModel::updateEvent($id, $userId, $body);
        if (!$event) {
            Response::error('Calendar event not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Calendar event updated',
            'event'   => $event
        ]);
    }

    public static function deleteEvent(int $id, int $userId): void {
        $deleted = CalendarModel::deleteEvent($id, $userId);
        if (!$deleted) {
            Response::error('Calendar event not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Calendar event deleted'
        ]);
    }
}
