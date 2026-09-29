const db = require('../config/db');

class PomodoroModel {
  static async logSession({ userId, duration_minutes = 25, task_id = null, started_at = null }) {
    const startTime = started_at || new Date().toISOString().replace('T', ' ').substring(0, 19);
    const result = await db.execute(
      `INSERT INTO pomodoro_sessions (user_id, started_at, duration_minutes, task_id)
       VALUES (?, ?, ?, ?)`,
      [userId, startTime, parseInt(duration_minutes, 10), task_id || null]
    );
    return this.findById(result.insertId, userId);
  }

  static async findById(id, userId) {
    return db.queryOne(
      `SELECT ps.*, t.title as task_title FROM pomodoro_sessions ps
       LEFT JOIN tasks t ON ps.task_id = t.id
       WHERE ps.id = ? AND ps.user_id = ?`,
      [id, userId]
    );
  }

  static async getHistory(userId, limit = 50) {
    return db.query(
      `SELECT ps.*, t.title as task_title FROM pomodoro_sessions ps
       LEFT JOIN tasks t ON ps.task_id = t.id
       WHERE ps.user_id = ?
       ORDER BY ps.started_at DESC LIMIT ?`,
      [userId, parseInt(limit, 10)]
    );
  }
}

module.exports = PomodoroModel;
