const db = require('../config/db');

/**
 * Calculates daily productivity score for a user on a given date (YYYY-MM-DD).
 * 
 * Formula:
 * Score = min(100, 0.4*S_tasks + 0.3*S_habits + 0.15*S_timetable + 0.15*S_pomodoro)
 * S_tasks = min(100, (completed_tasks / max(1, planned_tasks)) * 100)
 * S_habits = min(100, (completed_habits / max(1, total_habits)) * 100)
 * S_timetable = adherence rate 0-100 (planned blocks vs. blocks with completed activity)
 * S_pomodoro = min(100, (focus_minutes / 120) * 100)
 */
async function getDailyScore(userId, dateStr = null) {
  const date = dateStr || new Date().toISOString().split('T')[0];
  const targetDateObj = new Date(date);
  const dayOfWeek = targetDateObj.getDay(); // 0-6

  // 1. S_tasks
  const plannedTasksRes = await db.queryOne(
    `SELECT COUNT(*) as count FROM tasks 
     WHERE user_id = ? AND (due_date = ? OR DATE(created_at) = ?)`,
    [userId, date, date]
  );
  const plannedTasks = plannedTasksRes ? (plannedTasksRes.count || plannedTasksRes['COUNT(*)'] || 0) : 0;

  const completedTasksRes = await db.queryOne(
    `SELECT COUNT(*) as count FROM tasks 
     WHERE user_id = ? AND status = 'completed' AND DATE(completed_at) = ?`,
    [userId, date]
  );
  const completedTasks = completedTasksRes ? (completedTasksRes.count || completedTasksRes['COUNT(*)'] || 0) : 0;

  let sTasks = 100;
  if (plannedTasks > 0) {
    sTasks = Math.min(100, (completedTasks / Math.max(1, plannedTasks)) * 100);
  } else if (completedTasks > 0) {
    sTasks = 100;
  }

  // 2. S_habits
  const totalHabitsRes = await db.queryOne(
    `SELECT COUNT(*) as count FROM habits WHERE user_id = ?`,
    [userId]
  );
  const totalHabits = totalHabitsRes ? (totalHabitsRes.count || totalHabitsRes['COUNT(*)'] || 0) : 0;

  const completedHabitsRes = await db.queryOne(
    `SELECT COUNT(*) as count FROM habit_logs hl
     JOIN habits h ON hl.habit_id = h.id
     WHERE h.user_id = ? AND hl.date = ? AND hl.completed = 1`,
    [userId, date]
  );
  const completedHabits = completedHabitsRes ? (completedHabitsRes.count || completedHabitsRes['COUNT(*)'] || 0) : 0;

  let sHabits = 100;
  if (totalHabits > 0) {
    sHabits = Math.min(100, (completedHabits / Math.max(1, totalHabits)) * 100);
  }

  // 3. S_timetable
  const blocks = await db.query(
    `SELECT * FROM timetable_blocks WHERE user_id = ? AND day_of_week = ?`,
    [userId, dayOfWeek]
  );

  let sTimetable = 100;
  if (blocks.length > 0) {
    // Determine how many blocks have activity (either task completed, habit logged, or pomodoro logged)
    let coveredBlocks = 0;
    for (const block of blocks) {
      // Check if there is completed task in category or pomodoro session
      const catTask = await db.queryOne(
        `SELECT COUNT(*) as count FROM tasks 
         WHERE user_id = ? AND category = ? AND status = 'completed' AND DATE(completed_at) = ?`,
        [userId, block.category, date]
      );
      const catTaskCount = catTask ? (catTask.count || catTask['COUNT(*)'] || 0) : 0;

      const poms = await db.queryOne(
        `SELECT COUNT(*) as count FROM pomodoro_sessions 
         WHERE user_id = ? AND DATE(started_at) = ?`,
        [userId, date]
      );
      const pomCount = poms ? (poms.count || poms['COUNT(*)'] || 0) : 0;

      if (catTaskCount > 0 || completedHabits > 0 || pomCount > 0) {
        coveredBlocks++;
      }
    }
    sTimetable = (coveredBlocks / blocks.length) * 100;
  }

  // 4. S_pomodoro
  const pomRes = await db.queryOne(
    `SELECT SUM(duration_minutes) as mins FROM pomodoro_sessions 
     WHERE user_id = ? AND DATE(started_at) = ?`,
    [userId, date]
  );
  const focusMinutes = pomRes ? (pomRes.mins || 0) : 0;
  const sPomodoro = Math.min(100, (focusMinutes / 120) * 100);

  // Overall Score
  const scoreRaw = 0.4 * sTasks + 0.3 * sHabits + 0.15 * sTimetable + 0.15 * sPomodoro;
  const score = Math.round(Math.min(100, scoreRaw) * 10) / 10;

  return {
    date,
    score,
    breakdown: {
      sTasks: Math.round(sTasks * 10) / 10,
      sHabits: Math.round(sHabits * 10) / 10,
      sTimetable: Math.round(sTimetable * 10) / 10,
      sPomodoro: Math.round(sPomodoro * 10) / 10,
      plannedTasks,
      completedTasks,
      totalHabits,
      completedHabits,
      focusMinutes
    }
  };
}

module.exports = {
  getDailyScore
};
