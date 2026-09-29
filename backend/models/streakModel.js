const db = require('../config/db');

class StreakModel {
  static async getByUserId(userId) {
    let streak = await db.queryOne('SELECT * FROM streaks WHERE user_id = ?', [userId]);

    if (!streak) {
      const today = new Date().toISOString().split('T')[0];
      await db.execute(
        'INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES (?, 0, 0, NULL)',
        [userId]
      );
      streak = await db.queryOne('SELECT * FROM streaks WHERE user_id = ?', [userId]);
    }

    // Get active days in last 30 days
    const recentActivity = await db.query(
      'SELECT date, activity_points, intensity_bucket FROM daily_activity WHERE user_id = ? ORDER BY date DESC LIMIT 30',
      [userId]
    );

    return {
      current_streak: streak.current_streak || 0,
      longest_streak: streak.longest_streak || 0,
      last_active_date: streak.last_active_date,
      recentActivity
    };
  }
}

module.exports = StreakModel;
