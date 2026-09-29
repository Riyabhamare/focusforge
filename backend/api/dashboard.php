<?php
/**
 * FocusForge Dashboard API Endpoint
 * Consolidates all dashboard data directly from MySQL
 */

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../models/TaskModel.php';
require_once __DIR__ . '/../models/HabitModel.php';
require_once __DIR__ . '/../models/StreakModel.php';
require_once __DIR__ . '/../utils/DailyScore.php';

Response::initCors();
$authUser = AuthMiddleware::authenticate();
$userId = $authUser['id'];
$today = date('Y-m-d');

$user = UserModel::findById($userId);
$stats = UserModel::getStatsSummary($userId);
$tasks = TaskModel::findAll($userId, ['status' => 'all']);
$habits = HabitModel::findAll($userId);
$streak = StreakModel::getByUserId($userId);
$dailyScore = DailyScore::calculate($userId, $today);

Response::json([
    'success'    => true,
    'user'       => $user,
    'stats'      => $stats,
    'tasks'      => $tasks,
    'habits'     => $habits,
    'streak'     => $streak,
    'dailyScore' => $dailyScore
]);
