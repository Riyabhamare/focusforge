const db = require('../config/db');

class GoalModel {
  static async create({ userId, title, description, target_date = null, status = 'in_progress', progress_percent = 0 }) {
    const result = await db.execute(
      `INSERT INTO goals (user_id, title, description, target_date, status, progress_percent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, description || null, target_date || null, status, progress_percent]
    );
    return this.findById(result.insertId, userId);
  }

  static async findById(id, userId) {
    return db.queryOne('SELECT * FROM goals WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async findAll(userId) {
    return db.query('SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }

  static async update(id, userId, { title, description, target_date, status, progress_percent }) {
    await db.execute(
      `UPDATE goals SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        target_date = COALESCE(?, target_date),
        status = COALESCE(?, status),
        progress_percent = COALESCE(?, progress_percent)
       WHERE id = ? AND user_id = ?`,
      [title, description, target_date, status, progress_percent, id, userId]
    );
    return this.findById(id, userId);
  }

  static async updateProgress(id, userId, progress_percent) {
    const status = progress_percent >= 100 ? 'completed' : 'in_progress';
    await db.execute(
      'UPDATE goals SET progress_percent = ?, status = ? WHERE id = ? AND user_id = ?',
      [progress_percent, status, id, userId]
    );
    return this.findById(id, userId);
  }

  static async markCompleted(id, userId) {
    await db.execute(
      `UPDATE goals SET status = 'completed', progress_percent = 100 WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return this.findById(id, userId);
  }

  static async delete(id, userId) {
    const res = await db.execute('DELETE FROM goals WHERE id = ? AND user_id = ?', [id, userId]);
    return res.affectedRows > 0;
  }
}

module.exports = GoalModel;
