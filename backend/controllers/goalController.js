const GoalModel = require('../models/goalModel');
const { addXp, checkAndAwardBadges } = require('../utils/gamification');

exports.getGoals = async (req, res) => {
  try {
    const goals = await GoalModel.findAll(req.user.id);
    return res.json({ goals });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

exports.getGoalById = async (req, res) => {
  try {
    const goal = await GoalModel.findById(req.params.id, req.user.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    return res.json({ goal });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch goal' });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, description, target_date, status, progress_percent } = req.body;
    const goal = await GoalModel.create({
      userId: req.user.id,
      title,
      description,
      target_date,
      status,
      progress_percent
    });
    return res.status(201).json({ message: 'Goal created', goal });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create goal' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await GoalModel.update(req.params.id, req.user.id, req.body);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    return res.json({ message: 'Goal updated', goal });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update goal' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { progress_percent } = req.body;
    const goal = await GoalModel.updateProgress(req.params.id, req.user.id, progress_percent);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    let gamification = null;
    if (goal.status === 'completed') {
      const xpResult = await addXp(req.user.id, 50, `Finished goal: ${goal.title}`);
      const newlyUnlockedBadges = await checkAndAwardBadges(req.user.id);
      gamification = { xp: xpResult, newlyUnlockedBadges };
    }

    return res.json({ message: 'Goal progress updated', goal, gamification });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update goal progress' });
  }
};

exports.completeGoal = async (req, res) => {
  try {
    const goal = await GoalModel.markCompleted(req.params.id, req.user.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    // Trigger Gamification: +50 XP
    const xpResult = await addXp(req.user.id, 50, `Finished goal: ${goal.title}`);
    const newlyUnlockedBadges = await checkAndAwardBadges(req.user.id);

    return res.json({
      message: 'Goal completed',
      goal,
      gamification: {
        xp: xpResult,
        newlyUnlockedBadges
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to mark goal completed' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const deleted = await GoalModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Goal not found' });
    return res.json({ message: 'Goal deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete goal' });
  }
};
