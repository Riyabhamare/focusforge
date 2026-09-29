<?php
/**
 * FocusForge Profile API Endpoint
 * Handles GET (fetch profile) and POST/PUT (update profile)
 */

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/UserController.php';

Response::initCors();
$authUser = AuthMiddleware::authenticate();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    UserController::getProfile($authUser['id']);
} elseif ($method === 'PUT' || $method === 'POST') {
    UserController::updateSettings($authUser['id']);
} else {
    Response::error("Method {$method} not allowed", 405);
}
