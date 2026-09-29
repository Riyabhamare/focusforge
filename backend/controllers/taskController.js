const TaskModel = require('../models/taskModel');
const { addXp, updateStreak, updateDailyActivity, checkAndAwardBadges } = require('../utils/gamification');

exports.getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy, sortOrder } = req.query;
    const tasks = await TaskModel.findAll(req.user.id, { status, priority, category, search, sortBy, sortOrder });
    return res.json({ tasks });
  } catch (err) {
    console.error('getTasks error:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json({ task });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch task' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, category, priority, due_date, estimated_minutes } = req.body;
    const task = await TaskModel.create({
      userId: req.user.id,
      title,
      description,
      category,
      priority,
      due_date,
      estimated_minutes
    });
    return res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error('createTask error:', err);
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await TaskModel.update(req.params.id, req.user.id, req.body);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json({ message: 'Task updated', task });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await TaskModel.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    return res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await TaskModel.markCompleted(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const today = new Date().toISOString().split('T')[0];

    // Trigger Gamification: +10 XP, Streak, Activity Heatmap, Badge Check
    const xpResult = await addXp(req.user.id, 10, `Completed task: ${task.title}`);
    const streakResult = await updateStreak(req.user.id, today);
    await updateDailyActivity(req.user.id, today);
    const newlyUnlockedBadges = await checkAndAwardBadges(req.user.id);

    return res.json({
      message: 'Task completed',
      task,
      gamification: {
        xp: xpResult,
        streak: streakResult,
        newlyUnlockedBadges
      }
    });
  } catch (err) {
    console.error('completeTask error:', err);
    return res.status(500).json({ error: 'Failed to complete task' });
  }
};
