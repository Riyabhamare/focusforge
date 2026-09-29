const PomodoroModel = require('../models/pomodoroModel');
const { updateStreak, updateDailyActivity, checkAndAwardBadges } = require('../utils/gamification');

exports.logSession = async (req, res) => {
  try {
    const { duration_minutes = 25, task_id, started_at } = req.body;
    const session = await PomodoroModel.logSession({
      userId: req.user.id,
      duration_minutes,
      task_id,
      started_at
    });

    const dateStr = session.started_at ? session.started_at.split(' ')[0] : new Date().toISOString().split('T')[0];

    // Trigger streak + daily activity update + badge evaluation
    const streakResult = await updateStreak(req.user.id, dateStr);
    await updateDailyActivity(req.user.id, dateStr);
    const newlyUnlockedBadges = await checkAndAwardBadges(req.user.id);

    return res.status(201).json({
      message: 'Pomodoro session logged',
      session,
      gamification: {
        streak: streakResult,
        newlyUnlockedBadges
      }
    });
  } catch (err) {
    console.error('logSession error:', err);
    return res.status(500).json({ error: 'Failed to log pomodoro session' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const history = await PomodoroModel.getHistory(req.user.id, limit);
    return res.json({ history });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch pomodoro history' });
  }
};
