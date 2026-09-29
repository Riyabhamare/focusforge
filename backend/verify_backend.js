// Standalone backend smoke test — no AI/agent quota needed.
// Run with: node verify_backend.js
// Adjust BASE_URL and DEMO_PASSWORD if needed.

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@focusforge.app';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'demo1234'; // <-- check seed.sql for the real one

async function main() {
  console.log('--- FocusForge backend smoke test ---');
  console.log('Target:', BASE_URL);

  // 1. Login
  console.log('\n[1] Logging in as demo user...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
  });
  const loginBody = await loginRes.json();
  if (!loginRes.ok) {
    console.error('  LOGIN FAILED:', loginRes.status, loginBody);
    process.exit(1);
  }
  const token = loginBody.token || loginBody.accessToken;
  if (!token) {
    console.error('  No token found in login response:', loginBody);
    process.exit(1);
  }
  console.log('  OK — token received');
  const authHeader = { Authorization: `Bearer ${token}` };

  // 2. Fetch tasks
  console.log('\n[2] Fetching tasks...');
  const tasksRes = await fetch(`${BASE_URL}/tasks`, { headers: authHeader });
  const tasks = await tasksRes.json();
  if (!tasksRes.ok) {
    console.error('  FETCH TASKS FAILED:', tasksRes.status, tasks);
    process.exit(1);
  }
  const taskList = Array.isArray(tasks) ? tasks : tasks.tasks || [];
  console.log(`  OK — ${taskList.length} tasks found`);
  const pending = taskList.find(t => t.status !== 'completed' && t.status !== 'done');
  if (!pending) {
    console.log('  No pending task to complete — skipping XP test.');
  } else {
    // 3. Get XP before
    console.log('\n[3] Checking profile before completing a task...');
    const profBefore = await (await fetch(`${BASE_URL}/user/profile`, { headers: authHeader })).json();
    console.log('  RAW profile before:', JSON.stringify(profBefore, null, 2));
    // 4. Complete a task
    console.log(`\n[4] Completing task id=${pending.id}...`);
    const completeRes = await fetch(`${BASE_URL}/tasks/${pending.id}/complete`, {
      method: 'PATCH',
      headers: authHeader
    });
    const completeBody = await completeRes.json();
    if (!completeRes.ok) {
      console.error('  COMPLETE TASK FAILED:', completeRes.status, completeBody);
      process.exit(1);
    }
    console.log('  OK — response:', JSON.stringify(completeBody).slice(0, 300));

    // 5. Get XP after
    console.log('\n[5] Checking profile after...');
    const profAfter = await (await fetch(`${BASE_URL}/user/profile`, { headers: authHeader })).json();
    console.log('  RAW profile after:', JSON.stringify(profAfter, null, 2)); if (profAfter.xp > profBefore.xp) {
      console.log('  ✅ XP increased correctly');
    } else {
      console.error('  ❌ XP did NOT increase — check gamification.js');
    }
  }

  // 6. Streaks
  console.log('\n[6] Fetching streaks...');
  const streaksRes = await fetch(`${BASE_URL}/streaks`, { headers: authHeader });
  console.log('  Status:', streaksRes.status, await streaksRes.json());

  // 7. Badges
  console.log('\n[7] Fetching badges...');
  const badgesRes = await fetch(`${BASE_URL}/badges`, { headers: authHeader });
  const badges = await badgesRes.json();
  console.log('  RAW badges:', JSON.stringify(badges, null, 2));
  console.log('\n--- Done ---');
}

main().catch(err => {
  console.error('\nUNEXPECTED ERROR:', err);
  process.exit(1);
});
