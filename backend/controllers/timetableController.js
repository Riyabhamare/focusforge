const TimetableModel = require('../models/timetableModel');

exports.getWeek = async (req, res) => {
  try {
    const week = await TimetableModel.getWeek(req.user.id);
    return res.json({ week });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch timetable week' });
  }
};

exports.createBlock = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, category, color, title } = req.body;
    const block = await TimetableModel.create({
      userId: req.user.id,
      day_of_week,
      start_time,
      end_time,
      category,
      color,
      title
    });
    return res.status(201).json({ message: 'Timetable block created', block });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create timetable block' });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    const block = await TimetableModel.update(req.params.id, req.user.id, req.body);
    if (!block) return res.status(404).json({ error: 'Timetable block not found' });
    return res.json({ message: 'Timetable block updated', block });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update timetable block' });
  }
};

exports.deleteBlock = async (req, res) => {
  try {
    const deleted = await TimetableModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Timetable block not found' });
    return res.json({ message: 'Timetable block deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete timetable block' });
  }
};
