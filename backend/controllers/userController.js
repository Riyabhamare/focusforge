const UserModel = require('../models/userModel');

exports.getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

exports.getXpHistory = async (req, res) => {
  try {
    const history = await UserModel.getXpHistory(req.user.id);
    return res.json({ history });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch XP history' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await UserModel.getStatsSummary(req.user.id);
    return res.json({ stats });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ error: 'Failed to fetch user stats summary' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await UserModel.updateSettings(req.user.id, { name, avatar });
    return res.json({ message: 'Settings updated', user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
};
