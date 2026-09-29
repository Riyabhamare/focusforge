const db = require('../config/db');
const { badgeRules } = require('../utils/gamification');

class BadgeModel {
  static async getAllWithUserStatus(userId) {
    const allBadges = await db.query('SELECT * FROM badges');
    const userBadges = await db.query(
      'SELECT badge_id, unlocked_at FROM user_badges WHERE user_id = ?',
      [userId]
    );

    const unlockedMap = {};
    for (const ub of userBadges) {
      unlockedMap[ub.badge_id] = ub.unlocked_at;
    }

    const result = [];
    for (const b of allBadges) {
      const rule = badgeRules.find(r => r.key === b.key);
      let progress = { current: 0, target: 100 };

      if (rule) {
        try {
          const evalRes = await rule.check(userId);
          progress = { current: evalRes.current, target: evalRes.target };
        } catch (err) {
          console.error(`Error checking rule for badge ${b.key}:`, err);
        }
      }

      const unlocked = !!unlockedMap[b.id];

      result.push({
        id: b.id,
        key: b.key,
        name: b.name,
        description: b.description,
        icon: b.icon,
        unlocked,
        unlockedAt: unlocked ? unlockedMap[b.id] : null,
        progress: unlocked ? { current: progress.target, target: progress.target } : progress
      });
    }

    return result;
  }
}

module.exports = BadgeModel;
