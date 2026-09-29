<?php
/**
 * FocusForge Streak Controller
 */

require_once __DIR__ . '/../models/StreakModel.php';
require_once __DIR__ . '/../utils/Response.php';

class StreakController {
    public static function getStreak(int $userId): void {
        $streak = StreakModel::getByUserId($userId);
        Response::json([
            'success' => true,
            'streak'  => $streak
        ]);
    }
}
