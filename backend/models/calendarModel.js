const db = require('../config/db');

class CalendarModel {
  static async createEvent({ userId, title, date, time = null, type = 'event', ref_id = null }) {
    const result = await db.execute(
      `INSERT INTO calendar_events (user_id, title, date, time, type, ref_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, date, time || null, type, ref_id || null]
    );
    return this.findEventById(result.insertId, userId);
  }

  static async findEventById(id, userId) {
    return db.queryOne('SELECT * FROM calendar_events WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async findAllEvents(userId) {
    return db.query('SELECT * FROM calendar_events WHERE user_id = ? ORDER BY date ASC, time ASC', [userId]);
  }

  static async updateEvent(id, userId, { title, date, time, type, ref_id }) {
    await db.execute(
      `UPDATE calendar_events SET
        title = COALESCE(?, title),
        date = COALESCE(?, date),
        time = COALESCE(?, time),
        type = COALESCE(?, type),
        ref_id = COALESCE(?, ref_id)
       WHERE id = ? AND user_id = ?`,
      [title, date, time, type, ref_id, id, userId]
    );
    return this.findEventById(id, userId);
  }

  static async deleteEvent(id, userId) {
    const res = await db.execute('DELETE FROM calendar_events WHERE id = ? AND user_id = ?', [id, userId]);
    return res.affectedRows > 0;
  }

  /**
   * Merges tasks, habit logs, and calendar events for a full month (YYYY-MM).
   */
  static async getMonthView(userId, year, month) {
    // Zero-pad month if needed
    const paddedMonth = String(month).padStart(2, '0');
    const monthPattern = `${year}-${paddedMonth}%`;

    // 1. Calendar Events for month
    const events = await db.query(
      `SELECT id, title, date, time, type, ref_id FROM calendar_events 
       WHERE user_id = ? AND date LIKE ?`,
      [userId, monthPattern]
    );

    // 2. Tasks with due dates in month
    const tasks = await db.query(
      `SELECT id, title, due_date as date, priority, status FROM tasks
       WHERE user_id = ? AND due_date LIKE ?`,
      [userId, monthPattern]
    );

    // 3. Habit logs in month
    const habitLogs = await db.query(
      `SELECT hl.id, h.title, hl.date, hl.completed FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE h.user_id = ? AND hl.date LIKE ? AND hl.completed = 1`,
      [userId, monthPattern]
    );

    // Merge into calendar grid days map
    const daysMap = {};

    for (const e of events) {
      if (!daysMap[e.date]) daysMap[e.date] = [];
      daysMap[e.date].push({ id: e.id, title: e.title, time: e.time, type: e.type || 'event', ref_id: e.ref_id });
    }

    for (const t of tasks) {
      if (!daysMap[t.date]) daysMap[t.date] = [];
      daysMap[t.date].push({ id: `task-${t.id}`, title: `Task: ${t.title}`, type: 'task', priority: t.priority, status: t.status, ref_id: t.id });
    }

    for (const h of habitLogs) {
      if (!daysMap[h.date]) daysMap[h.date] = [];
      daysMap[h.date].push({ id: `habit-${h.id}`, title: `Habit: ${h.title}`, type: 'habit', completed: true, ref_id: h.id });
    }

    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      days: daysMap
    };
  }
}

module.exports = CalendarModel;
