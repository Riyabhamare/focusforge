<?php
/**
 * FocusForge Analytics Controller
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/DailyScore.php';

class AnalyticsController {
    public static function getDaily(int $userId): void {
        $targetDate = $_GET['date'] ?? date('Y-m-d');
        $scoreData = DailyScore::calculate($userId, $targetDate);
        $pdo = Database::getConnection();

        // Tasks for date
        $tStmt = $pdo->prepare("SELECT id, title, category, priority, status, completed_at FROM tasks 
            WHERE user_id = ? AND (due_date = ? OR DATE(completed_at) = ?)");
        $tStmt->execute([$userId, $targetDate, $targetDate]);
        $tasks = $tStmt->fetchAll();

        // Habits for date
        $hStmt = $pdo->prepare("SELECT h.id, h.title, h.category, hl.completed FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ? AND hl.date = ?");
        $hStmt->execute([$userId, $targetDate]);
        $habits = $hStmt->fetchAll();

        // Pomodoros for date
        $pStmt = $pdo->prepare("SELECT ps.id, ps.duration_minutes, ps.started_at, t.title as task_title FROM pomodoro_sessions ps
            LEFT JOIN tasks t ON ps.task_id = t.id
            WHERE ps.user_id = ? AND DATE(ps.started_at) = ?");
        $pStmt->execute([$userId, $targetDate]);
        $pomodoros = $pStmt->fetchAll();

        Response::json([
            'success' => true,
            'date'    => $targetDate,
            'score'   => $scoreData,
            'details' => [
                'tasks'     => $tasks,
                'habits'    => $habits,
                'pomodoros' => $pomodoros
            ]
        ]);
    }

    public static function getWeekly(int $userId): void {
        $startDate = $_GET['startDate'] ?? null;
        $end = $startDate ? new DateTime($startDate) : new DateTime();

        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $d = clone $end;
            $d->modify("-{$i} days");
            $dateStr = $d->format('Y-m-d');
            $score = DailyScore::calculate($userId, $dateStr);
            $days[] = $score;
        }

        $sum = array_sum(array_column($days, 'score'));
        $avgScore = round($sum / 7.0, 1);

        Response::json([
            'success'      => true,
            'startDate'    => $days[0]['date'],
            'endDate'      => $days[6]['date'],
            'averageScore' => $avgScore,
            'days'         => $days
        ]);
    }

    public static function getMonthly(int $userId): void {
        $now = new DateTime();
        $targetYear = isset($_GET['year']) ? (int)$_GET['year'] : (int)$now->format('Y');
        $targetMonth = isset($_GET['month']) ? (int)$_GET['month'] : (int)$now->format('m');

        $paddedMonth = str_pad((string)$targetMonth, 2, '0', STR_PAD_LEFT);
        $monthPattern = "{$targetYear}-{$paddedMonth}%";
        $daysInMonth = (int)cal_days_in_month(CAL_GREGORIAN, $targetMonth, $targetYear);

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT date, activity_points, intensity_bucket FROM daily_activity
            WHERE user_id = ? AND date LIKE ? ORDER BY date ASC");
        $stmt->execute([$userId, $monthPattern]);
        $activities = $stmt->fetchAll();

        $activeDays = 0;
        $totalPoints = 0;
        foreach ($activities as $a) {
            if ((int)$a['activity_points'] > 0) $activeDays++;
            $totalPoints += (int)$a['activity_points'];
        }

        Response::json([
            'success'             => true,
            'year'                => $targetYear,
            'month'               => $targetMonth,
            'totalDays'           => $daysInMonth,
            'activeDays'          => $activeDays,
            'totalActivityPoints' => $totalPoints,
            'activities'          => $activities
        ]);
    }

    public static function getCategoryDistribution(int $userId): void {
        $pdo = Database::getConnection();

        $tStmt = $pdo->prepare("SELECT category, COUNT(*) as count FROM tasks 
            WHERE user_id = ? AND status = 'completed' GROUP BY category");
        $tStmt->execute([$userId]);
        $tasksByCat = $tStmt->fetchAll();

        $hStmt = $pdo->prepare("SELECT h.category, COUNT(*) as count FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = ? AND hl.completed = 1 GROUP BY h.category");
        $hStmt->execute([$userId]);
        $habitsByCat = $hStmt->fetchAll();

        Response::json([
            'success'         => true,
            'tasksByCategory'  => $tasksByCat,
            'habitsByCategory' => $habitsByCat
        ]);
    }

    public static function getHeatmap(int $userId): void {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT date, activity_points, intensity_bucket FROM daily_activity
            WHERE user_id = ? ORDER BY date ASC");
        $stmt->execute([$userId]);
        $activities = $stmt->fetchAll();

        Response::json([
            'success' => true,
            'heatmap' => $activities
        ]);
    }
}
