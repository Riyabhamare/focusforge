const HabitModel = require('../models/habitModel');
const { addXp, updateStreak, updateDailyActivity, checkAndAwardBadges } = require('../utils/gamification');

exports.getHabits = async (req, res) => {
  try {
    const habits = await HabitModel.findAll(req.user.id);
    return res.json({ habits });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

exports.getHabitById = async (req, res) => {
  try {
    const habit = await HabitModel.findById(req.params.id, req.user.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    return res.json({ habit });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch habit' });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { title, category, frequency, target_count } = req.body;
    const habit = await HabitModel.create({
      userId: req.user.id,
      title,
      category,
      frequency,
      target_count
    });
    return res.status(201).json({ message: 'Habit created', habit });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create habit' });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const habit = await HabitModel.update(req.params.id, req.user.id, req.body);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    return res.json({ message: 'Habit updated', habit });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update habit' });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const deleted = await HabitModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Habit not found' });
    return res.json({ message: 'Habit deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete habit' });
  }
};

exports.logCompletion = async (req, res) => {
  try {
    const { date, completed = 1 } = req.body;
    const dateStr = date || new Date().toISOString().split('T')[0];

    const log = await HabitModel.logCompletion(req.params.id, req.user.id, dateStr, completed);
    const habit = await HabitModel.findById(req.params.id, req.user.id);

    let gamification = null;
    if (completed) {
      const xpResult = await addXp(req.user.id, 25, `Completed habit: ${habit.title}`);
      const streakResult = await updateStreak(req.user.id, dateStr);
      await updateDailyActivity(req.user.id, dateStr);
      const newlyUnlockedBadges = await checkAndAwardBadges(req.user.id);

      gamification = {
        xp: xpResult,
        streak: streakResult,
        newlyUnlockedBadges
      };
    }

    return res.json({
      message: completed ? 'Habit logged as completed' : 'Habit logged as incomplete',
      log,
      gamification
    });
  } catch (err) {
    console.error('logCompletion error:', err);
    return res.status(500).json({ error: err.message || 'Failed to log habit completion' });
  }
};
