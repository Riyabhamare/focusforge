const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./config');

let dbMode = null; // 'mysql' or 'sqlite'
let mysqlPool = null;
let sqliteDb = null;

/**
 * Normalizes SQL queries across MySQL and SQLite if needed.
 * Handles minor syntax differences like NOW() vs datetime('now'), AUTO_INCREMENT vs AUTOINCREMENT.
 */
function prepareSql(sql) {
  if (dbMode === 'sqlite') {
    return sql
      .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
      .replace(/CURRENT_TIMESTAMP\(\)/gi, "datetime('now')");
  }
  return sql;
}

/**
 * Initializes the database connection (MySQL primary, SQLite fallback).
 */
async function initDb() {
  if (dbMode) return dbMode;

  // Try MySQL connection
  try {
    const connection = await Promise.race([
      mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        port: config.mysql.port,
        connectTimeout: config.mysql.connectTimeout
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MySQL connection timeout')), config.mysql.connectTimeout + 200)
      )
    ]);

    await connection.ping();
    await connection.end();

    // Connection successful, create pool
    mysqlPool = mysql.createPool({
      host: config.mysql.host,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      port: config.mysql.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    dbMode = 'mysql';
    console.log(`[DB] Connected to MySQL database '${config.mysql.database}' at ${config.mysql.host}:${config.mysql.port}`);
    return dbMode;
  } catch (err) {
    console.warn(`[DB] MySQL connection failed (${err.message}). Falling back to local SQLite database.`);
  }

  // SQLite Fallback
  const dbDir = path.dirname(config.sqlite.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const isNewSqlite = !fs.existsSync(config.sqlite.dbPath);

  try {
    const Database = require('better-sqlite3');
    sqliteDb = new Database(config.sqlite.dbPath);
    sqliteDb.pragma('foreign_keys = ON');
    sqliteDb.pragma('journal_mode = WAL');
    dbMode = 'sqlite';
    console.log(`[DB] Active Database Mode: SQLite (better-sqlite3) -> ${config.sqlite.dbPath}`);
  } catch (err) {
    console.warn(`[DB] better-sqlite3 load error: ${err.message}. Trying sqlite3 fallback...`);
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(config.sqlite.dbPath);
    sqliteDb = {
      isSqlite3: true,
      db,
      prepare(sql) {
        return {
          all: (...params) => new Promise((resolve, reject) => {
            const flatParams = Array.isArray(params[0]) ? params[0] : params;
            db.all(sql, flatParams, (err, rows) => err ? reject(err) : resolve(rows));
          }),
          get: (...params) => new Promise((resolve, reject) => {
            const flatParams = Array.isArray(params[0]) ? params[0] : params;
            db.get(sql, flatParams, (err, row) => err ? reject(err) : resolve(row));
          }),
          run: (...params) => new Promise((resolve, reject) => {
            const flatParams = Array.isArray(params[0]) ? params[0] : params;
            db.run(sql, flatParams, function(err) {
              if (err) return reject(err);
              resolve({ insertId: this.lastID, affectedRows: this.changes, changes: this.changes });
            });
          })
        };
      },
      exec: (sql) => new Promise((resolve, reject) => {
        db.exec(sql, (err) => err ? reject(err) : resolve());
      })
    };
    dbMode = 'sqlite';
    console.log(`[DB] Active Database Mode: SQLite (sqlite3) -> ${config.sqlite.dbPath}`);
  }

  // If newly created SQLite database, apply schema & seed data
  await bootstrapSqliteSchemaAndSeed(isNewSqlite);

  return dbMode;
}

/**
 * Applier for SQLite schema and seed files if database tables do not exist.
 */
async function bootstrapSqliteSchemaAndSeed(isNewSqlite) {
  try {
    const schemaPath = path.join(__dirname, '../db/schema.sqlite.sql');
    const seedPath = path.join(__dirname, '../db/seed.sql');

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      if (sqliteDb.isSqlite3) {
        await sqliteDb.exec(schemaSql);
      } else {
        sqliteDb.exec(schemaSql);
      }
    }

    // Check if user table has demo user
    const existingUsers = await query('SELECT COUNT(*) as count FROM users');
    const userCount = Number(existingUsers[0]?.count ?? existingUsers[0]?.['COUNT(*)'] ?? 0);

    if (userCount === 0 && fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      if (sqliteDb.isSqlite3) {
        await sqliteDb.exec(seedSql);
      } else {
        sqliteDb.exec(seedSql);
      }
      console.log('[DB] Applied initial seed data successfully.');

      // Also generate 90 days heatmap data for demo user
      await seedHeatmapData(1);
    }
  } catch (err) {
    console.error('[DB] Error bootstrapping SQLite schema/seed:', err);
  }
}

/**
 * Generates ~90 days of varied daily activity for the demo user
 */
async function seedHeatmapData(userId) {
  try {
    const today = new Date();
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Random activity points between 0 and 100 with varied patterns
      const rand = Math.random();
      let pts = 0;
      let bucket = 0;

      if (rand > 0.15) { // 85% active days
        pts = Math.floor(Math.random() * 110);
        if (pts === 0) bucket = 0;
        else if (pts <= 25) bucket = 1;
        else if (pts <= 50) bucket = 2;
        else if (pts <= 75) bucket = 3;
        else bucket = 4;
      }

      if (dbMode === 'mysql') {
        await execute(
          `INSERT INTO daily_activity (user_id, date, activity_points, intensity_bucket) VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE activity_points = VALUES(activity_points), intensity_bucket = VALUES(intensity_bucket)`,
          [userId, dateStr, pts, bucket]
        );
      } else {
        await execute(
          `INSERT OR REPLACE INTO daily_activity (user_id, date, activity_points, intensity_bucket) VALUES (?, ?, ?, ?)`,
          [userId, dateStr, pts, bucket]
        );
      }
    }
  } catch (err) {
    console.error('[DB] Error seeding heatmap data:', err.message);
  }
}

/**
 * Universal query function returning array of rows
 */
async function query(sql, params = []) {
  if (!dbMode) await initDb();

  const prepared = prepareSql(sql);

  if (dbMode === 'mysql') {
    const [rows] = await mysqlPool.query(prepared, params);
    return rows;
  } else {
    if (sqliteDb.isSqlite3) {
      return await sqliteDb.prepare(prepared).all(params);
    } else {
      const stmt = sqliteDb.prepare(prepared);
      return stmt.all(params);
    }
  }
}

/**
 * Universal query returning single row object or null
 */
async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return (rows && rows.length > 0) ? rows[0] : null;
}

/**
 * Universal execute function for INSERT/UPDATE/DELETE
 */
async function execute(sql, params = []) {
  if (!dbMode) await initDb();

  const prepared = prepareSql(sql);

  if (dbMode === 'mysql') {
    const [result] = await mysqlPool.execute(prepared, params);
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows,
      changes: result.affectedRows
    };
  } else {
    if (sqliteDb.isSqlite3) {
      return await sqliteDb.prepare(prepared).run(params);
    } else {
      const stmt = sqliteDb.prepare(prepared);
      const info = stmt.run(params);
      return {
        insertId: Number(info.lastInsertRowid),
        affectedRows: info.changes,
        changes: info.changes
      };
    }
  }
}

function getMode() {
  return dbMode;
}

module.exports = {
  initDb,
  query,
  queryOne,
  execute,
  getMode,
  seedHeatmapData
};
