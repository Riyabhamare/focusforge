const db = require('../config/db');

class HabitModel {
  static async create({ userId, title, category = 'health', frequency = 'daily', target_count = 1 }) {
    const result = await db.execute(
      `INSERT INTO habits (user_id, title, category, frequency, target_count) VALUES (?, ?, ?, ?, ?)`,
      [userId, title, category, frequency, target_count]
    );
    return this.findById(result.insertId, userId);
  }

  static async findById(id, userId) {
    const habit = await db.queryOne('SELECT * FROM habits WHERE id = ? AND user_id = ?', [id, userId]);
    if (!habit) return null;

    // Attach recent logs (last 30 days)
    const logs = await db.query(
      'SELECT id, date, completed, created_at FROM habit_logs WHERE habit_id = ? ORDER BY date DESC LIMIT 30',
      [id]
    );
    habit.logs = logs;
    return habit;
  }

  static async findAll(userId) {
    const habits = await db.query('SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    for (const habit of habits) {
      const logs = await db.query(
        'SELECT id, date, completed, created_at FROM habit_logs WHERE habit_id = ? ORDER BY date DESC LIMIT 30',
        [habit.id]
      );
      habit.logs = logs;
    }

    return habits;
  }

  static async update(id, userId, { title, category, frequency, target_count }) {
    await db.execute(
      `UPDATE habits SET 
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        frequency = COALESCE(?, frequency),
        target_count = COALESCE(?, target_count)
       WHERE id = ? AND user_id = ?`,
      [title, category, frequency, target_count, id, userId]
    );
    return this.findById(id, userId);
  }

  static async delete(id, userId) {
    const res = await db.execute('DELETE FROM habits WHERE id = ? AND user_id = ?', [id, userId]);
    return res.affectedRows > 0;
  }

  static async logCompletion(habitId, userId, dateStr, completed = 1) {
    // Verify habit ownership
    const habit = await db.queryOne('SELECT id FROM habits WHERE id = ? AND user_id = ?', [habitId, userId]);
    if (!habit) throw new Error('Habit not found');

    const date = dateStr || new Date().toISOString().split('T')[0];

    if (db.getMode() === 'mysql') {
      await db.execute(
        `INSERT INTO habit_logs (habit_id, date, completed) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE completed = VALUES(completed)`,
        [habitId, date, completed ? 1 : 0]
      );
    } else {
      await db.execute(
        `INSERT INTO habit_logs (habit_id, date, completed) VALUES (?, ?, ?)
         ON CONFLICT(habit_id, date) DO UPDATE SET completed = excluded.completed`,
        [habitId, date, completed ? 1 : 0]
      );
    }

    return db.queryOne('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?', [habitId, date]);
  }
}

module.exports = HabitModel;
