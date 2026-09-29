const db = require('../config/db');

class NoteModel {
  static async create({ userId, title, content_markdown = '', linked_task_id = null, linked_goal_id = null, tags = '' }) {
    const result = await db.execute(
      `INSERT INTO notes (user_id, title, content_markdown, linked_task_id, linked_goal_id, tags)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, content_markdown, linked_task_id || null, linked_goal_id || null, tags || '']
    );
    return this.findById(result.insertId, userId);
  }

  static async findById(id, userId) {
    return db.queryOne('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async findAll(userId, { tag, linked_task_id, linked_goal_id, search } = {}) {
    let sql = 'SELECT * FROM notes WHERE user_id = ?';
    const params = [userId];

    if (tag) {
      sql += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }
    if (linked_task_id) {
      sql += ' AND linked_task_id = ?';
      params.push(linked_task_id);
    }
    if (linked_goal_id) {
      sql += ' AND linked_goal_id = ?';
      params.push(linked_goal_id);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR content_markdown LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY updated_at DESC';
    return db.query(sql, params);
  }

  static async update(id, userId, { title, content_markdown, linked_task_id, linked_goal_id, tags }) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await db.execute(
      `UPDATE notes SET 
        title = COALESCE(?, title),
        content_markdown = COALESCE(?, content_markdown),
        linked_task_id = COALESCE(?, linked_task_id),
        linked_goal_id = COALESCE(?, linked_goal_id),
        tags = COALESCE(?, tags),
        updated_at = ?
       WHERE id = ? AND user_id = ?`,
      [title, content_markdown, linked_task_id, linked_goal_id, tags, now, id, userId]
    );
    return this.findById(id, userId);
  }

  static async delete(id, userId) {
    const res = await db.execute('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
    return res.affectedRows > 0;
  }
}

module.exports = NoteModel;
