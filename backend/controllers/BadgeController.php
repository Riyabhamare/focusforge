<?php
/**
 * FocusForge Badge Controller
 */

require_once __DIR__ . '/../models/BadgeModel.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Gamification.php';

class BadgeController {
    public static function getBadges(int $userId): void {
        // Proactively evaluate badge criteria
        Gamification::checkAndAwardBadges($userId);
        $badges = BadgeModel::getAllWithUserStatus($userId);
        Response::json([
            'success' => true,
            'badges'  => $badges
        ]);
    }
}
