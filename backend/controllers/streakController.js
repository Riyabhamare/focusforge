const StreakModel = require('../models/streakModel');

exports.getStreak = async (req, res) => {
  try {
    const streak = await StreakModel.getByUserId(req.user.id);
    return res.json({ streak });
  } catch (err) {
    console.error('getStreak error:', err);
    return res.status(500).json({ error: 'Failed to fetch streak data' });
  }
};
