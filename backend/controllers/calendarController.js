const CalendarModel = require('../models/calendarModel');

exports.getMonthView = async (req, res) => {
  try {
    const { year, month } = req.query;
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || (now.getMonth() + 1);

    const monthView = await CalendarModel.getMonthView(req.user.id, targetYear, targetMonth);
    return res.json(monthView);
  } catch (err) {
    console.error('getMonthView error:', err);
    return res.status(500).json({ error: 'Failed to fetch calendar month view' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarModel.findAllEvents(req.user.id);
    return res.json({ events });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, date, time, type, ref_id } = req.body;
    const event = await CalendarModel.createEvent({
      userId: req.user.id,
      title,
      date,
      time,
      type,
      ref_id
    });
    return res.status(201).json({ message: 'Calendar event created', event });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create calendar event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await CalendarModel.updateEvent(req.params.id, req.user.id, req.body);
    if (!event) return res.status(404).json({ error: 'Calendar event not found' });
    return res.json({ message: 'Calendar event updated', event });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update calendar event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await CalendarModel.deleteEvent(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Calendar event not found' });
    return res.json({ message: 'Calendar event deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete calendar event' });
  }
};
