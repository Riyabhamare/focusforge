<?php
/**
 * FocusForge Note Controller
 */

require_once __DIR__ . '/../models/NoteModel.php';
require_once __DIR__ . '/../utils/Response.php';

class NoteController {
    public static function getNotes(int $userId): void {
        $filters = [
            'tag'            => $_GET['tag'] ?? null,
            'linked_task_id' => $_GET['linked_task_id'] ?? null,
            'linked_goal_id' => $_GET['linked_goal_id'] ?? null,
            'search'         => $_GET['search'] ?? null,
        ];
        $notes = NoteModel::findAll($userId, $filters);
        Response::json([
            'success' => true,
            'notes'   => $notes
        ]);
    }

    public static function getNoteById(int $id, int $userId): void {
        $note = NoteModel::findById($id, $userId);
        if (!$note) {
            Response::error('Note not found', 404);
        }
        Response::json([
            'success' => true,
            'note'    => $note
        ]);
    }

    public static function createNote(int $userId): void {
        $body = Response::getJsonBody();
        $title = trim($body['title'] ?? '');

        if (empty($title)) {
            Response::error('Note title is required', 400);
        }

        $note = NoteModel::create([
            'userId'           => $userId,
            'title'            => $title,
            'content_markdown' => $body['content_markdown'] ?? '',
            'linked_task_id'   => $body['linked_task_id'] ?? null,
            'linked_goal_id'   => $body['linked_goal_id'] ?? null,
            'tags'             => $body['tags'] ?? ''
        ]);

        Response::json([
            'success' => true,
            'message' => 'Note created',
            'note'    => $note
        ], 201);
    }

    public static function updateNote(int $id, int $userId): void {
        $body = Response::getJsonBody();
        $note = NoteModel::update($id, $userId, $body);
        if (!$note) {
            Response::error('Note not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Note updated',
            'note'    => $note
        ]);
    }

    public static function deleteNote(int $id, int $userId): void {
        $deleted = NoteModel::delete($id, $userId);
        if (!$deleted) {
            Response::error('Note not found', 404);
        }
        Response::json([
            'success' => true,
            'message' => 'Note deleted'
        ]);
    }
}
