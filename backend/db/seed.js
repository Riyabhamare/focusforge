const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runSeed() {
  console.log('=== FocusForge Database Seed Runner ===');
  const mode = await db.initDb();
  console.log(`[SEED] Active Database Mode: ${mode}`);

  const schemaPath = mode === 'mysql'
    ? path.join(__dirname, 'schema.sql')
    : path.join(__dirname, 'schema.sqlite.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found at: ${seedPath}`);
  }

  // 1. Apply Schema
  console.log(`[SEED] Applying schema from ${path.basename(schemaPath)}...`);
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  if (mode === 'sqlite') {
    // For SQLite, better-sqlite3 or sqlite3 exec
    const Database = require('better-sqlite3');
    const config = require('../config/config');
    const sqliteDb = new Database(config.sqlite.dbPath);
    sqliteDb.pragma('foreign_keys = OFF');
    sqliteDb.exec(schemaSql);

    // Clear existing data for clean re-seed
    console.log('[SEED] Clearing existing records for clean seed...');
    const tables = [
      'xp_log', 'user_badges', 'badges', 'pomodoro_sessions',
      'calendar_events', 'notes', 'goals', 'timetable_blocks',
      'daily_activity', 'streaks', 'habit_logs', 'habits', 'tasks', 'users'
    ];
    for (const tbl of tables) {
      try { sqliteDb.exec(`DELETE FROM ${tbl}`); } catch (e) {}
    }

    // Apply Seed SQL
    console.log(`[SEED] Applying demo data from ${path.basename(seedPath)}...`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    sqliteDb.exec(seedSql);
    sqliteDb.pragma('foreign_keys = ON');
    sqliteDb.close();
  } else {
    // MySQL mode
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    // Split schema statements and run
    const schemaStatements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    for (const stmt of schemaStatements) {
      await db.execute(stmt);
    }

    // Clear tables
    const tables = [
      'xp_log', 'user_badges', 'badges', 'pomodoro_sessions',
      'calendar_events', 'notes', 'goals', 'timetable_blocks',
      'daily_activity', 'streaks', 'habit_logs', 'habits', 'tasks', 'users'
    ];
    for (const tbl of tables) {
      try { await db.execute(`TRUNCATE TABLE ${tbl}`); } catch (e) {
        try { await db.execute(`DELETE FROM ${tbl}`); } catch (e2) {}
      }
    }

    // Apply Seed SQL
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    const seedStatements = seedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    for (const stmt of seedStatements) {
      await db.execute(stmt);
    }
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
  }

  // 2. Generate ~90 days of daily activity heatmap data for Demo User (id: 1)
  console.log('[SEED] Seeding ~90 days of daily_activity heatmap points...');
  await db.seedHeatmapData(1);

  // 3. Verification & Summary Output
  const demoUser = await db.queryOne('SELECT id, name, email, xp, level FROM users WHERE id = 1');
  const tasks = await db.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = 1');
  const habits = await db.query('SELECT COUNT(*) as count FROM habits WHERE user_id = 1');
  const timetable = await db.query('SELECT COUNT(*) as count FROM timetable_blocks WHERE user_id = 1');
  const goals = await db.query('SELECT COUNT(*) as count FROM goals WHERE user_id = 1');
  const badges = await db.query('SELECT COUNT(*) as count FROM badges');
  const userBadges = await db.query('SELECT COUNT(*) as count FROM user_badges WHERE user_id = 1');
  const activity = await db.query('SELECT COUNT(*) as count FROM daily_activity WHERE user_id = 1');

  const taskCount = tasks[0]?.count ?? tasks[0]?.['COUNT(*)'] ?? 0;
  const habitCount = habits[0]?.count ?? habits[0]?.['COUNT(*)'] ?? 0;
  const timetableCount = timetable[0]?.count ?? timetable[0]?.['COUNT(*)'] ?? 0;
  const goalCount = goals[0]?.count ?? goals[0]?.['COUNT(*)'] ?? 0;
  const badgeCount = badges[0]?.count ?? badges[0]?.['COUNT(*)'] ?? 0;
  const userBadgeCount = userBadges[0]?.count ?? userBadges[0]?.['COUNT(*)'] ?? 0;
  const activityCount = activity[0]?.count ?? activity[0]?.['COUNT(*)'] ?? 0;

  console.log('\n--- SEED VERIFICATION SUMMARY ---');
  console.log(`Demo User:        ${demoUser ? `${demoUser.name} <${demoUser.email}> (Level ${demoUser.level}, ${demoUser.xp} XP)` : 'NOT FOUND'}`);
  console.log(`Tasks:            ${taskCount} loaded`);
  console.log(`Habits:           ${habitCount} loaded`);
  console.log(`Timetable Blocks: ${timetableCount} loaded`);
  console.log(`Goals:            ${goalCount} loaded`);
  console.log(`Badges Defined:   ${badgeCount} badges`);
  console.log(`Unlocked Badges:  ${userBadgeCount} unlocked`);
  console.log(`Daily Activity:   ${activityCount} days recorded`);
  console.log('---------------------------------');
  console.log('[SEED] Database seed completed successfully!\n');

  process.exit(0);
}

if (require.main === module) {
  runSeed().catch(err => {
    console.error('[SEED FATAL ERROR]', err);
    process.exit(1);
  });
}

module.exports = { runSeed };
