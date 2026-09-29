<?php
/**
 * FocusForge Calendar Model
 */

require_once __DIR__ . '/../config/database.php';

class CalendarModel {
    public static function createEvent(array $data): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO calendar_events (user_id, title, date, time, type, ref_id)
            VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['userId'],
            $data['title'],
            $data['date'],
            $data['time'] ?? null,
            $data['type'] ?? 'event',
            !empty($data['ref_id']) ? (int)$data['ref_id'] : null
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findEventById($id, $data['userId']);
    }

    public static function findEventById(int $id, int $userId): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM calendar_events WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $event = $stmt->fetch();
        return $event ?: null;
    }

    public static function findAllEvents(int $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM calendar_events WHERE user_id = ? ORDER BY date ASC, time ASC');
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function updateEvent(int $id, int $userId, array $data): ?array {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [];

        $allowed = ['title', 'date', 'time', 'type', 'ref_id'];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $fields[] = "{$col} = ?";
                $params[] = ($col === 'ref_id' && !empty($data[$col])) ? (int)$data[$col] : $data[$col];
            }
        }

        if (empty($fields)) {
            return self::findEventById($id, $userId);
        }

        $params[] = $id;
        $params[] = $userId;
        $sql = 'UPDATE calendar_events SET ' . implode(', ', $fields) . ' WHERE id = ? AND user_id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findEventById($id, $userId);
    }

    public static function deleteEvent(int $id, int $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('DELETE FROM calendar_events WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public static function getMonthView(int $userId, int $year, int $month): array {
        $pdo = Database::getConnection();
        $paddedMonth = str_pad((string)$month, 2, '0', STR_PAD_LEFT);
        $monthPattern = "{$year}-{$paddedMonth}%";

        // 1. Calendar Events
        $eStmt = $pdo->prepare('SELECT id, title, date, time, type, ref_id FROM calendar_events WHERE user_id = ? AND date LIKE ?');
        $eStmt->execute([$userId, $monthPattern]);
        $events = $eStmt->fetchAll();

        // 2. Tasks
        $tStmt = $pdo->prepare('SELECT id, title, due_date as date, priority, status FROM tasks WHERE user_id = ? AND due_date LIKE ?');
        $tStmt->execute([$userId, $monthPattern]);
        $tasks = $tStmt->fetchAll();

        // 3. Habit logs
        $hStmt = $pdo->prepare('SELECT hl.id, h.title, hl.date, hl.completed FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = ? AND hl.date LIKE ? AND hl.completed = 1');
        $hStmt->execute([$userId, $monthPattern]);
        $habitLogs = $hStmt->fetchAll();

        $daysMap = [];

        foreach ($events as $e) {
            $d = $e['date'];
            if (!isset($daysMap[$d])) $daysMap[$d] = [];
            $daysMap[$d][] = [
                'id'     => $e['id'],
                'title'  => $e['title'],
                'time'   => $e['time'],
                'type'   => $e['type'] ?: 'event',
                'ref_id' => $e['ref_id']
            ];
        }

        foreach ($tasks as $t) {
            $d = $t['date'];
            if (!isset($daysMap[$d])) $daysMap[$d] = [];
            $daysMap[$d][] = [
                'id'       => "task-{$t['id']}",
                'title'    => "Task: {$t['title']}",
                'type'     => 'task',
                'priority' => $t['priority'],
                'status'   => $t['status'],
                'ref_id'   => $t['id']
            ];
        }

        foreach ($habitLogs as $h) {
            $d = $h['date'];
            if (!isset($daysMap[$d])) $daysMap[$d] = [];
            $daysMap[$d][] = [
                'id'        => "habit-{$h['id']}",
                'title'     => "Habit: {$h['title']}",
                'type'      => 'habit',
                'completed' => true,
                'ref_id'    => $h['id']
            ];
        }

        return [
            'year'  => $year,
            'month' => $month,
            'days'  => $daysMap
        ];
    }
}
