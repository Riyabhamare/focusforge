const BadgeModel = require('../models/badgeModel');
const { checkAndAwardBadges } = require('../utils/gamification');

exports.getBadges = async (req, res) => {
  try {
    // Proactively check if user qualifies for any new badges
    await checkAndAwardBadges(req.user.id);
    const badges = await BadgeModel.getAllWithUserStatus(req.user.id);
    return res.json({ badges });
  } catch (err) {
    console.error('getBadges error:', err);
    return res.status(500).json({ error: 'Failed to fetch badges' });
  }
};
