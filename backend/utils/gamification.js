const db = require('../config/db');

/**
 * Level formula: Level(XP) = floor(1 + sqrt(XP / 250))
 */
function calculateLevel(xp) {
  if (!xp || xp < 0) return 1;
  return Math.floor(1 + Math.sqrt(xp / 250));
}

/**
 * Awards XP to user, logs to xp_log, updates users table, and checks for level-up.
 */
async function addXp(userId, amount, reason) {
  const user = await db.queryOne('SELECT xp, level FROM users WHERE id = ?', [userId]);
  if (!user) return { xpGained: 0, newTotalXp: 0, newLevel: 1, leveledUp: false };

  const currentXp = user.xp || 0;
  const currentLevel = user.level || 1;
  const newTotalXp = currentXp + amount;
  const newLevel = calculateLevel(newTotalXp);
  const leveledUp = newLevel > currentLevel;

  // Log XP event
  await db.execute(
    'INSERT INTO xp_log (user_id, amount, reason) VALUES (?, ?, ?)',
    [userId, amount, reason]
  );

  // Update user record
  await db.execute(
    'UPDATE users SET xp = ?, level = ? WHERE id = ?',
    [newTotalXp, newLevel, userId]
  );

  return {
    xpGained: amount,
    newTotalXp,
    newLevel,
    leveledUp
  };
}

/**
 * Updates streak tracking for user on active actions.
 */
async function updateStreak(userId, dateStr = null) {
  const today = dateStr || new Date().toISOString().split('T')[0];
  let streak = await db.queryOne('SELECT * FROM streaks WHERE user_id = ?', [userId]);

  if (!streak) {
    await db.execute(
      'INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES (?, 1, 1, ?)',
      [userId, today]
    );
    return { current_streak: 1, longest_streak: 1, last_active_date: today };
  }

  const lastActive = streak.last_active_date;
  if (lastActive === today) {
    return {
      current_streak: streak.current_streak,
      longest_streak: streak.longest_streak,
      last_active_date: today
    };
  }

  // Calculate day difference
  let currentStreak = streak.current_streak;
  let longestStreak = streak.longest_streak;

  if (lastActive) {
    const lastDate = new Date(lastActive);
    const currDate = new Date(today);
    const diffTime = Math.abs(currDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak += 1;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  await db.execute(
    'UPDATE streaks SET current_streak = ?, longest_streak = ?, last_active_date = ? WHERE user_id = ?',
    [currentStreak, longestStreak, today, userId]
  );

  return { current_streak: currentStreak, longest_streak: longestStreak, last_active_date: today };
}

/**
 * Recomputes activity points and intensity bucket for a specific user and date,
 * then upserts into daily_activity table.
 */
async function updateDailyActivity(userId, dateStr = null) {
  const date = dateStr || new Date().toISOString().split('T')[0];

  // 1. Completed tasks on date
  const taskRes = await db.queryOne(
    `SELECT COUNT(*) as count FROM tasks 
     WHERE user_id = ? AND status = 'completed' AND DATE(completed_at) = ?`,
    [userId, date]
  );
  const completedTasks = taskRes ? (taskRes.count || taskRes['COUNT(*)'] || 0) : 0;

  // 2. Completed habits on date
  const habitRes = await db.queryOne(
    `SELECT COUNT(*) as count FROM habit_logs hl
     JOIN habits h ON hl.habit_id = h.id
     WHERE h.user_id = ? AND hl.date = ? AND hl.completed = 1`,
    [userId, date]
  );
  const completedHabits = habitRes ? (habitRes.count || habitRes['COUNT(*)'] || 0) : 0;

  // 3. Focus minutes on date
  const pomRes = await db.queryOne(
    `SELECT SUM(duration_minutes) as mins FROM pomodoro_sessions
     WHERE user_id = ? AND DATE(started_at) = ?`,
    [userId, date]
  );
  const focusMinutes = pomRes ? (pomRes.mins || 0) : 0;

  // Activity points = completed_tasks*10 + completed_habits*15 + focus_minutes*1
  const activityPoints = (completedTasks * 10) + (completedHabits * 15) + (focusMinutes * 1);

  // Intensity buckets: 0 -> 0, 1 -> 1-25, 2 -> 26-50, 3 -> 51-75, 4 -> 76+
  let intensityBucket = 0;
  if (activityPoints > 0 && activityPoints <= 25) intensityBucket = 1;
  else if (activityPoints > 25 && activityPoints <= 50) intensityBucket = 2;
  else if (activityPoints > 50 && activityPoints <= 75) intensityBucket = 3;
  else if (activityPoints > 75) intensityBucket = 4;

  if (db.getMode() === 'mysql') {
    await db.execute(
      `INSERT INTO daily_activity (user_id, date, activity_points, intensity_bucket)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE activity_points = VALUES(activity_points), intensity_bucket = VALUES(intensity_bucket)`,
      [userId, date, activityPoints, intensityBucket]
    );
  } else {
    await db.execute(
      `INSERT INTO daily_activity (user_id, date, activity_points, intensity_bucket)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id, date) DO UPDATE SET activity_points = excluded.activity_points, intensity_bucket = excluded.intensity_bucket`,
      [userId, date, activityPoints, intensityBucket]
    );
  }

  return { date, activityPoints, intensityBucket };
}

/**
 * Pluggable Badge Evaluation Engine
 */
const badgeRules = [
  {
    key: 'early_bird',
    name: 'Early Bird',
    description: 'Completed 10 morning habit logs before 9am',
    check: async (userId) => {
      // Check habit logs created or logged before 09:00:00
      const res = await db.queryOne(
        `SELECT COUNT(*) as count FROM habit_logs hl
         JOIN habits h ON hl.habit_id = h.id
         WHERE h.user_id = ? AND hl.completed = 1 AND (TIME(hl.created_at) < '09:00:00' OR strftime('%H:%M:%S', hl.created_at) < '09:00:00')`,
        [userId]
      );
      const count = res ? (res.count || res['COUNT(*)'] || 0) : 0;
      return { qualified: count >= 10, current: count, target: 10 };
    }
  },
  {
    key: 'consistent',
    name: 'Consistent Crusader',
    description: 'Maintained a 30-day active streak',
    check: async (userId) => {
      const streak = await db.queryOne('SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?', [userId]);
      const maxStreak = streak ? Math.max(streak.current_streak || 0, streak.longest_streak || 0) : 0;
      return { qualified: maxStreak >= 30, current: maxStreak, target: 30 };
    }
  },
  {
    key: 'focus_master',
    name: 'Focus Master',
    description: 'Completed 1,000 cumulative Pomodoro minutes',
    check: async (userId) => {
      const res = await db.queryOne('SELECT SUM(duration_minutes) as mins FROM pomodoro_sessions WHERE user_id = ?', [userId]);
      const totalMins = res ? (res.mins || 0) : 0;
      return { qualified: totalMins >= 1000, current: totalMins, target: 1000 };
    }
  },
  {
    key: 'century_club',
    name: 'Century Club',
    description: 'Completed 100 tasks',
    check: async (userId) => {
      const res = await db.queryOne("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'", [userId]);
      const count = res ? (res.count || res['COUNT(*)'] || 0) : 0;
      return { qualified: count >= 100, current: count, target: 100 };
    }
  },
  {
    key: 'first_week',
    name: 'First Week Champion',
    description: 'Completed 7 consecutive active days',
    check: async (userId) => {
      const streak = await db.queryOne('SELECT current_streak, longest_streak FROM streaks WHERE user_id = ?', [userId]);
      const maxStreak = streak ? Math.max(streak.current_streak || 0, streak.longest_streak || 0) : 0;
      return { qualified: maxStreak >= 7, current: maxStreak, target: 7 };
    }
  }
];

/**
 * Checks all badge rules for user, unlocks newly qualified ones, and returns them.
 */
async function checkAndAwardBadges(userId) {
  const newlyUnlocked = [];

  // Get user's existing badges
  const existingBadges = await db.query(
    `SELECT b.key FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = ?`,
    [userId]
  );
  const unlockedKeys = new Set(existingBadges.map(b => b.key));

  for (const rule of badgeRules) {
    if (unlockedKeys.has(rule.key)) continue; // Already unlocked

    const evalResult = await rule.check(userId);
    if (evalResult.qualified) {
      // Find badge definition id
      const badgeDef = await db.queryOne('SELECT id, key, name, description, icon FROM badges WHERE key = ?', [rule.key]);
      if (badgeDef) {
        if (db.getMode() === 'mysql') {
          await db.execute('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeDef.id]);
        } else {
          await db.execute('INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeDef.id]);
        }
        newlyUnlocked.push(badgeDef);
      }
    }
  }

  return newlyUnlocked;
}

module.exports = {
  calculateLevel,
  addXp,
  updateStreak,
  updateDailyActivity,
  badgeRules,
  checkAndAwardBadges
};
