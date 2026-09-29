const db = require('../config/db');
const { getDailyScore } = require('../utils/dailyScore');

exports.getDaily = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const scoreData = await getDailyScore(req.user.id, targetDate);

    // Fetch detailed activity for date
    const tasks = await db.query(
      `SELECT id, title, category, priority, status, completed_at FROM tasks 
       WHERE user_id = ? AND (due_date = ? OR DATE(completed_at) = ?)`,
      [req.user.id, targetDate, targetDate]
    );

    const habits = await db.query(
      `SELECT h.id, h.title, h.category, hl.completed FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE h.user_id = ? AND hl.date = ?`,
      [req.user.id, targetDate]
    );

    const pomodoros = await db.query(
      `SELECT ps.id, ps.duration_minutes, ps.started_at, t.title as task_title FROM pomodoro_sessions ps
       LEFT JOIN tasks t ON ps.task_id = t.id
       WHERE ps.user_id = ? AND DATE(ps.started_at) = ?`,
      [req.user.id, targetDate]
    );

    return res.json({
      date: targetDate,
      score: scoreData,
      details: {
        tasks,
        habits,
        pomodoros
      }
    });
  } catch (err) {
    console.error('getDaily analytics error:', err);
    return res.status(500).json({ error: 'Failed to calculate daily analytics' });
  }
};

exports.getWeekly = async (req, res) => {
  try {
    const { startDate } = req.query;
    const end = startDate ? new Date(startDate) : new Date();
    
    // Generate 7 days ending at target date
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const score = await getDailyScore(req.user.id, dateStr);
      days.push(score);
    }

    const avgScore = days.reduce((sum, d) => sum + d.score, 0) / 7;

    return res.json({
      startDate: days[0].date,
      endDate: days[6].date,
      averageScore: Math.round(avgScore * 10) / 10,
      days
    });
  } catch (err) {
    console.error('getWeekly analytics error:', err);
    return res.status(500).json({ error: 'Failed to fetch weekly analytics' });
  }
};

exports.getMonthly = async (req, res) => {
  try {
    const { year, month } = req.query;
    const now = new Date();
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();
    const targetMonth = month ? parseInt(month, 10) : now.getMonth() + 1;

    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const paddedMonth = String(targetMonth).padStart(2, '0');
    const monthPattern = `${targetYear}-${paddedMonth}%`;

    const activities = await db.query(
      `SELECT date, activity_points, intensity_bucket FROM daily_activity
       WHERE user_id = ? AND date LIKE ? ORDER BY date ASC`,
      [req.user.id, monthPattern]
    );

    const activeDaysCount = activities.filter(a => a.activity_points > 0).length;
    const totalPoints = activities.reduce((sum, a) => sum + a.activity_points, 0);

    return res.json({
      year: targetYear,
      month: targetMonth,
      totalDays: daysInMonth,
      activeDays: activeDaysCount,
      totalActivityPoints: totalPoints,
      activities
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch monthly analytics' });
  }
};

exports.getCategoryDistribution = async (req, res) => {
  try {
    const tasksByCat = await db.query(
      `SELECT category, COUNT(*) as count FROM tasks 
       WHERE user_id = ? AND status = 'completed' GROUP BY category`,
      [req.user.id]
    );

    const habitsByCat = await db.query(
      `SELECT h.category, COUNT(*) as count FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE h.user_id = ? AND hl.completed = 1 GROUP BY h.category`,
      [req.user.id]
    );

    return res.json({
      tasksByCategory: tasksByCat,
      habitsByCategory: habitsByCat
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch category distribution' });
  }
};

exports.getHeatmap = async (req, res) => {
  try {
    const activities = await db.query(
      `SELECT date, activity_points, intensity_bucket FROM daily_activity
       WHERE user_id = ? ORDER BY date ASC`,
      [req.user.id]
    );
    return res.json({ heatmap: activities });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
};
