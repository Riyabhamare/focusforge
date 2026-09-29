<?php
/**
 * FocusForge Master PHP Router & Entry Point
 * Routes RESTful API requests to appropriate controllers
 */

require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/TaskController.php';
require_once __DIR__ . '/controllers/HabitController.php';
require_once __DIR__ . '/controllers/StreakController.php';
require_once __DIR__ . '/controllers/TimetableController.php';
require_once __DIR__ . '/controllers/AnalyticsController.php';
require_once __DIR__ . '/controllers/GoalController.php';
require_once __DIR__ . '/controllers/NoteController.php';
require_once __DIR__ . '/controllers/CalendarController.php';
require_once __DIR__ . '/controllers/PomodoroController.php';
require_once __DIR__ . '/controllers/BadgeController.php';

// Initialize CORS & handle preflight OPTIONS
Response::initCors();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize path: strip script name or project path prefixes
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && str_starts_with($uri, $scriptName)) {
    $uri = substr($uri, strlen($scriptName));
}

// Strip trailing slashes and clean up
$uri = '/' . trim($uri, '/');

// If path starts with /api, remove /api prefix for matching
$route = $uri;
if (str_starts_with($route, '/api/')) {
    $route = substr($route, 4);
} elseif ($route === '/api') {
    $route = '/';
}

// Strip .php extension if present
$route = preg_replace('/\.php$/i', '', $route);
if ($route === '') $route = '/';

// -----------------------------------------------------------------------------
// ROUTE DISPATCHER
// -----------------------------------------------------------------------------

// API Health Check
if ($route === '/health' && $method === 'GET') {
    Response::json([
        'status'    => 'ok',
        'appName'   => 'FocusForge PHP API',
        'dbMode'    => 'mysql',
        'timestamp' => date('c')
    ]);
}

// Auth endpoints
if ($route === '/auth/register' && $method === 'POST') {
    AuthController::register();
}
if ($route === '/auth/login' && $method === 'POST') {
    AuthController::login();
}
if (($route === '/auth/demo-login' || $route === '/auth/guest-login') && $method === 'POST') {
    AuthController::demoLogin();
}
if ($route === '/auth/forgot-password' && $method === 'POST') {
    AuthController::forgotPassword();
}
if ($route === '/auth/me' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    AuthController::getMe($user['id']);
}

// User & Profile endpoints
if (($route === '/user' || $route === '/user/profile' || $route === '/profile') && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    UserController::getProfile($user['id']);
}
if (($route === '/user/settings' || $route === '/profile') && ($method === 'PUT' || $method === 'POST')) {
    $user = AuthMiddleware::authenticate();
    UserController::updateSettings($user['id']);
}
if ($route === '/user/xp-history' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    UserController::getXpHistory($user['id']);
}
if ($route === '/user/stats' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    UserController::getStats($user['id']);
}

// Consolidated Dashboard endpoint
if ($route === '/dashboard' && $method === 'GET') {
    $authUser = AuthMiddleware::authenticate();
    $userId = $authUser['id'];
    $today = date('Y-m-d');

    $u = UserModel::findById($userId);
    $stats = UserModel::getStatsSummary($userId);
    $tasks = TaskModel::findAll($userId, ['status' => 'all']);
    $habits = HabitModel::findAll($userId);
    $streak = StreakModel::getByUserId($userId);
    $dailyScore = DailyScore::calculate($userId, $today);

    Response::json([
        'success'    => true,
        'user'       => $u,
        'stats'      => $stats,
        'tasks'      => $tasks,
        'habits'     => $habits,
        'streak'     => $streak,
        'dailyScore' => $dailyScore
    ]);
}

// Tasks endpoints
if ($route === '/tasks' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    TaskController::getTasks($user['id']);
}
if ($route === '/tasks' && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    TaskController::createTask($user['id']);
}
if (preg_match('#^/tasks/([0-9]+)$#', $route, $m)) {
    $user = AuthMiddleware::authenticate();
    $taskId = (int)$m[1];
    if ($method === 'GET') TaskController::getTaskById($taskId, $user['id']);
    if ($method === 'PUT') TaskController::updateTask($taskId, $user['id']);
    if ($method === 'DELETE') TaskController::deleteTask($taskId, $user['id']);
}
if (preg_match('#^/tasks/([0-9]+)/complete$#', $route, $m) && ($method === 'PATCH' || $method === 'POST')) {
    $user = AuthMiddleware::authenticate();
    TaskController::completeTask((int)$m[1], $user['id']);
}

// Habits endpoints
if ($route === '/habits' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    HabitController::getHabits($user['id']);
}
if ($route === '/habits' && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    HabitController::createHabit($user['id']);
}
if (preg_match('#^/habits/([0-9]+)$#', $route, $m)) {
    $user = AuthMiddleware::authenticate();
    $habitId = (int)$m[1];
    if ($method === 'GET') HabitController::getHabitById($habitId, $user['id']);
    if ($method === 'PUT') HabitController::updateHabit($habitId, $user['id']);
    if ($method === 'DELETE') HabitController::deleteHabit($habitId, $user['id']);
}
if (preg_match('#^/habits/([0-9]+)/log$#', $route, $m) && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    HabitController::logCompletion((int)$m[1], $user['id']);
}

// Streaks endpoints
if ($route === '/streaks' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    StreakController::getStreak($user['id']);
}

// Timetable endpoints
if ($route === '/timetable' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    TimetableController::getWeek($user['id']);
}
if ($route === '/timetable' && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    TimetableController::createBlock($user['id']);
}
if (preg_match('#^/timetable/([0-9]+)$#', $route, $m)) {
    $user = AuthMiddleware::authenticate();
    $blockId = (int)$m[1];
    if ($method === 'PUT') TimetableController::updateBlock($blockId, $user['id']);
    if ($method === 'DELETE') TimetableController::deleteBlock($blockId, $user['id']);
}

// Analytics endpoints
if ($route === '/analytics/daily' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    AnalyticsController::getDaily($user['id']);
}
if ($route === '/analytics/weekly' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    AnalyticsController::getWeekly($user['id']);
}
if ($route === '/analytics/monthly' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    AnalyticsController::getMonthly($user['id']);
}
if ($route === '/analytics/categories' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    AnalyticsController::getCategoryDistribution($user['id']);
}
if ($route === '/analytics/heatmap' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    AnalyticsController::getHeatmap($user['id']);
}

// Goals endpoints
if ($route === '/goals' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    GoalController::getGoals($user['id']);
}
if ($route === '/goals' && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    GoalController::createGoal($user['id']);
}
if (preg_match('#^/goals/([0-9]+)$#', $route, $m)) {
    $user = AuthMiddleware::authenticate();
    $goalId = (int)$m[1];
    if ($method === 'GET') GoalController::getGoalById($goalId, $user['id']);
    if ($method === 'PUT') GoalController::updateGoal($goalId, $user['id']);
    if ($method === 'DELETE') GoalController::deleteGoal($goalId, $user['id']);
}
if (preg_match('#^/goals/([0-9]+)/complete$#', $route, $m) && ($method === 'PATCH' || $method === 'POST')) {
    $user = AuthMiddleware::authenticate();
    GoalController::completeGoal((int)$m[1], $user['id']);
}
if (preg_match('#^/goals/([0-9]+)/progress$#', $route, $m) && ($method === 'PATCH' || $method === 'POST')) {
    $user = AuthMiddleware::authenticate();
    GoalController::updateProgress((int)$m[1], $user['id']);
}

// Notes endpoints
if ($route === '/notes' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    NoteController::getNotes($user['id']);
}
if ($route === '/notes' && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    NoteController::createNote($user['id']);
}
if (preg_match('#^/notes/([0-9]+)$#', $route, $m)) {
    $user = AuthMiddleware::authenticate();
    $noteId = (int)$m[1];
    if ($method === 'GET') NoteController::getNoteById($noteId, $user['id']);
    if ($method === 'PUT') NoteController::updateNote($noteId, $user['id']);
    if ($method === 'DELETE') NoteController::deleteNote($noteId, $user['id']);
}

// Calendar endpoints
if ($route === '/calendar/month' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    CalendarController::getMonthView($user['id']);
}
if ($route === '/calendar/events' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    CalendarController::getEvents($user['id']);
}
if ($route === '/calendar/events' && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    CalendarController::createEvent($user['id']);
}
if (preg_match('#^/calendar/events/([0-9]+)$#', $route, $m)) {
    $user = AuthMiddleware::authenticate();
    $eventId = (int)$m[1];
    if ($method === 'PUT') CalendarController::updateEvent($eventId, $user['id']);
    if ($method === 'DELETE') CalendarController::deleteEvent($eventId, $user['id']);
}

// Pomodoro endpoints
if ($route === '/pomodoro/sessions' && $method === 'POST') {
    $user = AuthMiddleware::authenticate();
    PomodoroController::logSession($user['id']);
}
if ($route === '/pomodoro/sessions' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    PomodoroController::getHistory($user['id']);
}

// Badges endpoints
if ($route === '/badges' && $method === 'GET') {
    $user = AuthMiddleware::authenticate();
    BadgeController::getBadges($user['id']);
}

// 404 Catch-all
Response::error("Cannot {$method} {$uri}", 404);
