const app = require('./app');
const config = require('./config/config');
const db = require('./config/db');

async function startServer() {
  try {
    console.log('Starting FocusForge Backend Server...');
    const mode = await db.initDb();
    console.log(`[SERVER] Database initialization complete (Active Mode: ${mode})`);

    const server = app.listen(config.port, () => {
      console.log(`[SERVER] FocusForge API running at http://localhost:${config.port}`);
    });

    return server;
  } catch (err) {
    console.error('[SERVER] Startup failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
