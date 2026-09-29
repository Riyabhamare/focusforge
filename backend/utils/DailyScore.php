<?php
/**
 * FocusForge Daily Productivity Score Engine
 */

require_once __DIR__ . '/../config/database.php';

class DailyScore {
    public static function calculate(int $userId, ?string $dateStr = null): array {
        $date = $dateStr ?: date('Y-m-d');
        $targetDateObj = new DateTime($date);
        $dayOfWeek = (int)$targetDateObj->format('w'); // 0 (Sun) - 6 (Sat)
        $pdo = Database::getConnection();

        // 1. S_tasks
        $planStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM tasks WHERE user_id = ? AND (due_date = ? OR DATE(created_at) = ?)");
        $planStmt->execute([$userId, $date, $date]);
        $plannedTasks = (int)($planStmt->fetch()['cnt'] ?? 0);

        $compStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM tasks WHERE user_id = ? AND status = 'completed' AND DATE(completed_at) = ?");
        $compStmt->execute([$userId, $date]);
        $completedTasks = (int)($compStmt->fetch()['cnt'] ?? 0);

        $sTasks = 100.0;
        if ($plannedTasks > 0) {
            $sTasks = min(100.0, ($completedTasks / max(1, $plannedTasks)) * 100.0);
        } elseif ($completedTasks > 0) {
            $sTasks = 100.0;
        }

        // 2. S_habits
        $habTotStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM habits WHERE user_id = ?");
        $habTotStmt->execute([$userId]);
        $totalHabits = (int)($habTotStmt->fetch()['cnt'] ?? 0);

        $habCompStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = ? AND hl.date = ? AND hl.completed = 1");
        $habCompStmt->execute([$userId, $date]);
        $completedHabits = (int)($habCompStmt->fetch()['cnt'] ?? 0);

        $sHabits = 100.0;
        if ($totalHabits > 0) {
            $sHabits = min(100.0, ($completedHabits / max(1, $totalHabits)) * 100.0);
        }

        // 3. S_timetable
        $blockStmt = $pdo->prepare("SELECT * FROM timetable_blocks WHERE user_id = ? AND day_of_week = ?");
        $blockStmt->execute([$userId, $dayOfWeek]);
        $blocks = $blockStmt->fetchAll();

        $sTimetable = 100.0;
        if (count($blocks) > 0) {
            $coveredBlocks = 0;
            foreach ($blocks as $b) {
                $catStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM tasks WHERE user_id = ? AND category = ? AND status = 'completed' AND DATE(completed_at) = ?");
                $catStmt->execute([$userId, $b['category'], $date]);
                $catCount = (int)($catStmt->fetch()['cnt'] ?? 0);

                $pStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM pomodoro_sessions WHERE user_id = ? AND DATE(started_at) = ?");
                $pStmt->execute([$userId, $date]);
                $pomCount = (int)($pStmt->fetch()['cnt'] ?? 0);

                if ($catCount > 0 || $completedHabits > 0 || $pomCount > 0) {
                    $coveredBlocks++;
                }
            }
            $sTimetable = ($coveredBlocks / count($blocks)) * 100.0;
        }

        // 4. S_pomodoro
        $pomRes = $pdo->prepare("SELECT SUM(duration_minutes) as mins FROM pomodoro_sessions WHERE user_id = ? AND DATE(started_at) = ?");
        $pomRes->execute([$userId, $date]);
        $focusMinutes = (int)($pomRes->fetch()['mins'] ?? 0);
        $sPomodoro = min(100.0, ($focusMinutes / 120.0) * 100.0);

        // Overall Score
        $scoreRaw = (0.4 * $sTasks) + (0.3 * $sHabits) + (0.15 * $sTimetable) + (0.15 * $sPomodoro);
        $score = round(min(100.0, $scoreRaw), 1);

        return [
            'date'      => $date,
            'score'     => $score,
            'breakdown' => [
                'sTasks'          => round($sTasks, 1),
                'sHabits'         => round($sHabits, 1),
                'sTimetable'      => round($sTimetable, 1),
                'sPomodoro'       => round($sPomodoro, 1),
                'plannedTasks'    => $plannedTasks,
                'completedTasks'  => $completedTasks,
                'totalHabits'     => $totalHabits,
                'completedHabits' => $completedHabits,
                'focusMinutes'    => $focusMinutes
            ]
        ];
    }
}
