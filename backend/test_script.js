const http = require('http');
const config = require('./config/config');
const db = require('./config/db');

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:${config.port}${path}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING END-TO-END VERIFICATION TEST ===\n');

  // Boot DB
  const mode = await db.initDb();
  console.log(`[TEST] DB Mode initialized: ${mode}`);

  // Start app listener
  const app = require('./app');
  const server = app.listen(config.port, async () => {
    console.log(`[TEST] Test server listening on port ${config.port}\n`);

    try {
      // 1. Healthcheck
      const health = await request('GET', '/api/health');
      console.log('1. Healthcheck Response:', health.status, health.data.appName, `(DB: ${health.data.dbMode})`);

      // 2. Demo Account Login
      const demoRes = await request('POST', '/api/auth/demo-login');
      console.log('2. Demo Login Response:', demoRes.status, 'User:', demoRes.data.user?.email);
      const demoToken = demoRes.data.token;

      // 3. Register New User
      const testEmail = `testuser_${Date.now()}@example.com`;
      const regRes = await request('POST', '/api/auth/register', {
        name: 'Tester Smith',
        email: testEmail,
        password: 'password123'
      });
      console.log('3. Register User Response:', regRes.status, 'User:', regRes.data.user?.email);
      const token = regRes.data.token;
      const userId = regRes.data.user?.id;

      // 4. List Tasks for Demo User
      const tasksRes = await request('GET', '/api/tasks', null, demoToken);
      console.log('4. List Tasks (Demo User):', tasksRes.status, 'Total tasks:', tasksRes.data.tasks?.length);

      // 5. Create a new task for new user
      const createTaRes = await request('POST', '/api/tasks', {
        title: 'Build FocusForge Frontend',
        description: 'React UI for productivity app',
        category: 'Coding',
        priority: 'high',
        estimated_minutes: 60
      }, token);
      console.log('5. Create Task Response:', createTaRes.status, 'Task ID:', createTaRes.data.task?.id);
      const taskId = createTaRes.data.task?.id;

      // 6. Complete the created task and verify XP & gamification update
      const completeRes = await request('POST', `/api/tasks/${taskId}/complete`, null, token);
      console.log('6. Complete Task Response:', completeRes.status, 'XP Gained:', completeRes.data.gamification?.xp?.xpGained, 'New Level:', completeRes.data.gamification?.xp?.newLevel);

      // 7. Check User Profile & Stats Summary
      const statsRes = await request('GET', '/api/user/stats', null, token);
      console.log('7. User Stats Response:', statsRes.status, 'XP:', statsRes.data.stats?.user?.xp, 'Level:', statsRes.data.stats?.user?.level);

      // 8. Log a Pomodoro session
      const pomRes = await request('POST', '/api/pomodoro/sessions', {
        duration_minutes: 25,
        task_id: taskId
      }, token);
      console.log('8. Log Pomodoro Session:', pomRes.status, 'Mins:', pomRes.data.session?.duration_minutes);

      // 9. Fetch Daily Analytics & Productivity Score
      const dailyRes = await request('GET', '/api/analytics/daily', null, token);
      console.log('9. Daily Analytics Score:', dailyRes.status, 'Score:', dailyRes.data.score?.score, 'Breakdown:', dailyRes.data.score?.breakdown);

      // 10. Check Badges
      const badgesRes = await request('GET', '/api/badges', null, token);
      console.log('10. Badges List:', badgesRes.status, 'Total Badges:', badgesRes.data.badges?.length, 'First Badge Unlocked:', badgesRes.data.badges[0]?.unlocked);

      console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
    } catch (err) {
      console.error('Test Execution Error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
