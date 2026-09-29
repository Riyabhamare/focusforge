const db = require('../config/db');

class UserModel {
  static async create({ name, email, passwordHash, avatar = 'default' }) {
    const result = await db.execute(
      'INSERT INTO users (name, email, password_hash, avatar, xp, level) VALUES (?, ?, ?, ?, 0, 1)',
      [name, email, passwordHash, avatar]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    return db.queryOne('SELECT id, name, email, avatar, xp, level, created_at FROM users WHERE id = ?', [id]);
  }

  static async findByEmail(email) {
    return db.queryOne('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async updateSettings(id, { name, avatar }) {
    await db.execute(
      'UPDATE users SET name = COALESCE(?, name), avatar = COALESCE(?, avatar) WHERE id = ?',
      [name, avatar, id]
    );
    return this.findById(id);
  }

  static async getXpHistory(userId) {
    return db.query(
      'SELECT id, amount, reason, created_at FROM xp_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
  }

  static async getStatsSummary(userId) {
    const tasks = await db.queryOne(
      `SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
       FROM tasks WHERE user_id = ?`,
      [userId]
    );

    const habits = await db.queryOne('SELECT COUNT(*) as total_habits FROM habits WHERE user_id = ?', [userId]);
    const streak = await db.queryOne('SELECT current_streak, longest_streak, last_active_date FROM streaks WHERE user_id = ?', [userId]);
    const pomodoro = await db.queryOne('SELECT SUM(duration_minutes) as total_focus_minutes FROM pomodoro_sessions WHERE user_id = ?', [userId]);
    const user = await this.findById(userId);

    return {
      user,
      tasks: {
        total: tasks ? (tasks.total_tasks || 0) : 0,
        completed: tasks ? (tasks.completed_tasks || 0) : 0,
        pending: tasks ? (tasks.pending_tasks || 0) : 0
      },
      habits: {
        total: habits ? (habits.total_habits || 0) : 0
      },
      streak: {
        current: streak ? (streak.current_streak || 0) : 0,
        longest: streak ? (streak.longest_streak || 0) : 0,
        lastActiveDate: streak ? streak.last_active_date : null
      },
      focusMinutes: pomodoro ? (pomodoro.total_focus_minutes || 0) : 0
    };
  }
}

module.exports = UserModel;
