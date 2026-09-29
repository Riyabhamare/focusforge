const db = require('../config/db');

class TimetableModel {
  static async getWeek(userId) {
    const blocks = await db.query(
      'SELECT * FROM timetable_blocks WHERE user_id = ? ORDER BY day_of_week ASC, start_time ASC',
      [userId]
    );

    // Group by day of week 0-6
    const week = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (const b of blocks) {
      if (week[b.day_of_week]) {
        week[b.day_of_week].push(b);
      }
    }
    return week;
  }

  static async findById(id, userId) {
    return db.queryOne('SELECT * FROM timetable_blocks WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async create({ userId, day_of_week, start_time, end_time, category = 'study', color = '#4F46E5', title }) {
    const result = await db.execute(
      `INSERT INTO timetable_blocks (user_id, day_of_week, start_time, end_time, category, color, title)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, parseInt(day_of_week, 10), start_time, end_time, category, color, title]
    );
    return this.findById(result.insertId, userId);
  }

  static async update(id, userId, { day_of_week, start_time, end_time, category, color, title }) {
    await db.execute(
      `UPDATE timetable_blocks SET
        day_of_week = COALESCE(?, day_of_week),
        start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time),
        category = COALESCE(?, category),
        color = COALESCE(?, color),
        title = COALESCE(?, title)
       WHERE id = ? AND user_id = ?`,
      [day_of_week !== undefined ? parseInt(day_of_week, 10) : null, start_time, end_time, category, color, title, id, userId]
    );
    return this.findById(id, userId);
  }

  static async delete(id, userId) {
    const res = await db.execute('DELETE FROM timetable_blocks WHERE id = ? AND user_id = ?', [id, userId]);
    return res.affectedRows > 0;
  }
}

module.exports = TimetableModel;
