const NoteModel = require('../models/noteModel');

exports.getNotes = async (req, res) => {
  try {
    const { tag, linked_task_id, linked_goal_id, search } = req.query;
    const notes = await NoteModel.findAll(req.user.id, { tag, linked_task_id, linked_goal_id, search });
    return res.json({ notes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await NoteModel.findById(req.params.id, req.user.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.json({ note });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch note' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content_markdown, linked_task_id, linked_goal_id, tags } = req.body;
    const note = await NoteModel.create({
      userId: req.user.id,
      title,
      content_markdown,
      linked_task_id,
      linked_goal_id,
      tags
    });
    return res.status(201).json({ message: 'Note created', note });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await NoteModel.update(req.params.id, req.user.id, req.body);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.json({ message: 'Note updated', note });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const deleted = await NoteModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    return res.json({ message: 'Note deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete note' });
  }
};
