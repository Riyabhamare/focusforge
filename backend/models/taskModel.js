const db = require('../config/db');

class TaskModel {
  static async create({ userId, title, description, category = 'general', priority = 'medium', due_date = null, estimated_minutes = 30 }) {
    const result = await db.execute(
      `INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, estimated_minutes)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [userId, title, description || null, category, priority, due_date || null, estimated_minutes]
    );
    return this.findById(result.insertId, userId);
  }

  static async findById(id, userId) {
    return db.queryOne('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async findAll(userId, { status, priority, category, search, sortBy = 'created_at', sortOrder = 'DESC' } = {}) {
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const validSortFields = ['created_at', 'due_date', 'priority', 'title', 'status'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${orderField} ${orderDirection}`;

    return db.query(sql, params);
  }

  static async update(id, userId, { title, description, category, priority, status, due_date, estimated_minutes }) {
    await db.execute(
      `UPDATE tasks SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        priority = COALESCE(?, priority),
        status = COALESCE(?, status),
        due_date = COALESCE(?, due_date),
        estimated_minutes = COALESCE(?, estimated_minutes)
       WHERE id = ? AND user_id = ?`,
      [title, description, category, priority, status, due_date, estimated_minutes, id, userId]
    );
    return this.findById(id, userId);
  }

  static async markCompleted(id, userId) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await db.execute(
      `UPDATE tasks SET status = 'completed', completed_at = ? WHERE id = ? AND user_id = ?`,
      [now, id, userId]
    );
    return this.findById(id, userId);
  }

  static async delete(id, userId) {
    const res = await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    return res.affectedRows > 0;
  }
}

module.exports = TaskModel;
