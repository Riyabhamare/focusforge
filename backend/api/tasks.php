<?php
/**
 * FocusForge Tasks API Endpoint
 */

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/TaskController.php';

Response::initCors();
$authUser = AuthMiddleware::authenticate();
$userId = $authUser['id'];
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$id) {
    $body = Response::getJsonBody();
    if (!empty($body['id'])) {
        $id = (int)$body['id'];
    }
}

$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($id) {
            TaskController::getTaskById($id, $userId);
        } else {
            TaskController::getTasks($userId);
        }
        break;

    case 'POST':
        if ($id && $action === 'complete') {
            TaskController::completeTask($id, $userId);
        } else {
            TaskController::createTask($userId);
        }
        break;

    case 'PUT':
        if (!$id) {
            Response::error('Task ID required for update', 400);
        }
        TaskController::updateTask($id, $userId);
        break;

    case 'PATCH':
        if (!$id) {
            Response::error('Task ID required', 400);
        }
        TaskController::completeTask($id, $userId);
        break;

    case 'DELETE':
        if (!$id) {
            Response::error('Task ID required for deletion', 400);
        }
        TaskController::deleteTask($id, $userId);
        break;

    default:
        Response::error("Method {$method} not allowed", 405);
}
