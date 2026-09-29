<?php
/**
 * FocusForge User & Profile Controller
 */

require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../utils/Response.php';

class UserController {
    public static function getProfile(int $userId): void {
        $user = UserModel::findById($userId);
        if (!$user) {
            Response::error('User not found', 404);
        }
        Response::json([
            'success' => true,
            'user'    => $user
        ]);
    }

    public static function updateSettings(int $userId): void {
        $body = Response::getJsonBody();
        $name = isset($body['name']) ? trim($body['name']) : null;
        $avatar = isset($body['avatar']) ? trim($body['avatar']) : null;

        if ($name !== null && $name === '') {
            Response::error('Name cannot be empty', 400);
        }

        $user = UserModel::updateSettings($userId, $name, $avatar);
        if (!$user) {
            Response::error('User not found or update failed', 404);
        }

        // Also update session user if active
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_name'] = $user['name'];

        Response::json([
            'success' => true,
            'message' => 'Settings updated',
            'user'    => $user
        ]);
    }

    public static function getXpHistory(int $userId): void {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $history = UserModel::getXpHistory($userId, $limit);
        Response::json([
            'success' => true,
            'history' => $history
        ]);
    }

    public static function getStats(int $userId): void {
        $stats = UserModel::getStatsSummary($userId);
        Response::json([
            'success' => true,
            'stats'   => $stats
        ]);
    }
}
