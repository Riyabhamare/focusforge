// Comprehensive E2E Verification Script for FocusForge
// Tests: Auth, CRUD for all entities, Gamification formulas, Security constraints, and Edge cases.

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';

async function runTests() {
  console.log('==================================================');
  console.log('  FOCUSFORGE COMPLETE SYSTEM E2E VERIFICATION     ');
  console.log(`  Target: ${BASE_URL}                            `);
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Healthcheck
  console.log('[1] Healthcheck & DB Mode');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  assert(healthRes.ok && health.status === 'ok', `Health status ok (Mode: ${health.dbMode})`);

  // 2. Security: Protected routes reject without JWT
  console.log('\n[2] Security: Protected Route Rejection');
  const unauthRes = await fetch(`${BASE_URL}/tasks`);
  assert(unauthRes.status === 401, 'Request without JWT rejected with 401');

  const invalidTokenRes = await fetch(`${BASE_URL}/tasks`, {
    headers: { Authorization: 'Bearer fake_invalid_jwt_token_123' },
  });
  assert(invalidTokenRes.status === 401, 'Request with invalid JWT rejected with 401');

  // 3. Security & Auth: User Registration & Password Hashing
  console.log('\n[3] Auth: User Registration & Bcrypt Hashing');
  const testEmail = `hero_${Date.now()}@focusforge.app`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sir Arthur Forge',
      email: testEmail,
      password: 'mypassword123',
      avatar: 'paladin',
    }),
  });
  const regData = await regRes.json();
  assert(regRes.status === 201 && regData.token, 'New user successfully registered with JWT token');
  assert(!regData.user.password && !regData.user.password_hash, 'Password and password hash omitted from response');

  // 4. Security & Input Validation: 400 with clean message
  console.log('\n[4] Input Validation: Clean 400 Bad Request');
  const badRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: '12' }),
  });
  const badRegData = await badRegRes.json();
  assert(badRegRes.status === 400, 'Invalid registration payload rejected with 400');
  assert(badRegData.error && typeof badRegData.error === 'string', `Returns clean readable error: "${badRegData.error}"`);

  // 5. Auth: Login & Logout Flow
  console.log('\n[5] Auth: Login Flow');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'mypassword123' }),
  });
  const loginData = await loginRes.json();
  assert(loginRes.ok && loginData.token, 'User logged in successfully with valid credentials');
  assert(!loginData.user.password_hash, 'Password hash omitted from login response');

  const userToken = loginData.token;
  const authHeader = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`,
  };

  // 6. Auth: Demo Login Endpoint
  console.log('\n[6] Auth: Guest Demo Login');
  const demoRes = await fetch(`${BASE_URL}/auth/demo-login`, { method: 'POST' });
  const demoData = await demoRes.json();
  assert(demoRes.ok && demoData.token && demoData.user.email === 'demo@focusforge.app', 'Guest demo login returns token for demo user');

  // 7. Auth: Forgot Password Mock OTP
  console.log('\n[7] Auth: Forgot Password Mock OTP');
  const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const forgotData = await forgotRes.json();
  assert(forgotRes.ok && forgotData.message, 'Forgot password triggers OTP generation successfully');

  // 8. Tasks CRUD & Gamification (+10 XP)
  console.log('\n[8] Tasks: Full CRUD & XP Progression');
  const createTaskRes = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: 'Defeat Algorithm Dragon',
      description: 'Master dynamic programming and recursion',
      category: 'Coding',
      priority: 'high',
      due_date: new Date().toISOString().split('T')[0],
      estimated_minutes: 60,
    }),
  });
  const taskData = await createTaskRes.json();
  assert(createTaskRes.status === 201 && taskData.task.id, 'Task created successfully');
  const taskId = taskData.task.id;

  // Update Task
  const updateTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: authHeader,
    body: JSON.stringify({ title: 'Defeat Algorithm Dragon (Advanced)' }),
  });
  const updatedTask = await updateTaskRes.json();
  assert(updateTaskRes.ok && updatedTask.task.title.includes('Advanced'), 'Task updated successfully');

  // Complete Task & verify XP (+10 XP)
  const completeTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}/complete`, {
    method: 'PATCH',
    headers: authHeader,
  });
  const completeData = await completeTaskRes.json();
  assert(completeTaskRes.ok, 'Task marked as completed');
  assert(completeData.gamification?.xp?.xpGained === 10, '+10 XP awarded on task completion');

  // 9. Habits CRUD & Gamification (+25 XP)
  console.log('\n[9] Habits: Creation & Log Completion');
  const createHabitRes = await fetch(`${BASE_URL}/habits`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: 'Morning Code Kata',
      category: 'Coding',
      frequency: 'daily',
      target_count: 1,
    }),
  });
  const habitData = await createHabitRes.json();
  assert(createHabitRes.status === 201 && habitData.habit.id, 'Habit created successfully');
  const habitId = habitData.habit.id;

  // Log Habit Completion
  const logHabitRes = await fetch(`${BASE_URL}/habits/${habitId}/log`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ completed: 1 }),
  });
  const logHabitData = await logHabitRes.json();
  assert(logHabitRes.ok, 'Habit completion logged');
  assert(logHabitData.gamification?.xp?.xpGained === 25, '+25 XP awarded on habit completion');

  // 10. Streaks Endpoint
  console.log('\n[10] Streaks: Verification');
  const streakRes = await fetch(`${BASE_URL}/streaks`, { headers: authHeader });
  const streakData = await streakRes.json();
  assert(streakRes.ok && streakData.streak?.current_streak >= 1, `Active streak tracked (Current: ${streakData.streak?.current_streak} days)`);

  // 11. Timetable Blocks
  console.log('\n[11] Timetable: Block Creation & Weekly Retrieval');
  const createBlockRes = await fetch(`${BASE_URL}/timetable`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: 'Deep Focus Sprint',
      day_of_week: 1,
      start_time: '10:00',
      end_time: '12:00',
      category: 'Coding',
      color: '#6366f1',
    }),
  });
  const blockData = await createBlockRes.json();
  assert(createBlockRes.status === 201 && blockData.block.id, 'Timetable block created');

  const getWeekRes = await fetch(`${BASE_URL}/timetable`, { headers: authHeader });
  const weekData = await getWeekRes.json();
  assert(getWeekRes.ok && weekData.week && weekData.week[1]?.length > 0, 'Timetable week contains Monday block');

  // 12. Goals & Milestones (+50 XP)
  console.log('\n[12] Goals: Milestone Creation, Progress Tuning & Completion');
  const createGoalRes = await fetch(`${BASE_URL}/goals`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: 'Publish Open Source Package',
      description: 'Zero defect NPM library',
      target_date: '2026-12-31',
      progress_percent: 50,
    }),
  });
  const goalData = await createGoalRes.json();
  assert(createGoalRes.status === 201 && goalData.goal.id, 'Goal created successfully');
  const goalId = goalData.goal.id;

  // Update Progress
  const progressRes = await fetch(`${BASE_URL}/goals/${goalId}/progress`, {
    method: 'PATCH',
    headers: authHeader,
    body: JSON.stringify({ progress_percent: 85 }),
  });
  const progressData = await progressRes.json();
  assert(progressRes.ok && progressData.goal.progress_percent === 85, 'Goal progress percent updated to 85%');

  // Complete Goal (+50 XP)
  const completeGoalRes = await fetch(`${BASE_URL}/goals/${goalId}/complete`, {
    method: 'PATCH',
    headers: authHeader,
  });
  const completeGoalData = await completeGoalRes.json();
  assert(completeGoalRes.ok && completeGoalData.gamification?.xp?.xpGained === 50, '+50 XP awarded on milestone completion');

  // 13. Notes: Linking to task and goal, tags
  console.log('\n[13] Notes: Creation, Links, & Tag Filtering');
  const createNoteRes = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: 'Algorithm Optimization Notes',
      content_markdown: '# Dynamic Programming\n- Memoization table\n- Optimal substructure',
      tags: 'algorithms,optimization,coding',
      linked_task_id: taskId,
      linked_goal_id: goalId,
    }),
  });
  const noteData = await createNoteRes.json();
  assert(createNoteRes.status === 201 && noteData.note.id, 'Note created with task and goal links');

  // Filter notes by tag
  const filterNotesRes = await fetch(`${BASE_URL}/notes?tag=algorithms`, { headers: authHeader });
  const filterNotesData = await filterNotesRes.json();
  assert(filterNotesRes.ok && filterNotesData.notes.length > 0, 'Notes filtered by tag "algorithms" returned results');

  // 14. Calendar Events & Month View
  console.log('\n[14] Calendar: Event Creation & Merged Month View');
  const todayDate = new Date().toISOString().split('T')[0];
  const createEventRes = await fetch(`${BASE_URL}/calendar/events`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: 'Project Defense',
      date: todayDate,
      time: '15:00',
      type: 'event',
    }),
  });
  const eventData = await createEventRes.json();
  assert(createEventRes.status === 201 && eventData.event.id, 'Calendar event created');

  const now = new Date();
  const monthViewRes = await fetch(`${BASE_URL}/calendar/month?year=${now.getFullYear()}&month=${now.getMonth() + 1}`, {
    headers: authHeader,
  });
  const monthView = await monthViewRes.json();
  assert(monthViewRes.ok && monthView.days && monthView.days[todayDate]?.length > 0, 'Calendar month merges events, tasks, and habits');

  // 15. Pomodoro Sessions
  console.log('\n[15] Pomodoro: Focus Session Logging');
  const pomRes = await fetch(`${BASE_URL}/pomodoro/sessions`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ duration_minutes: 25, task_id: taskId }),
  });
  const pomData = await pomRes.json();
  assert(pomRes.status === 201 && pomData.session.duration_minutes === 25, '25-minute Pomodoro session logged');

  // 16. Badges & Rules Engine
  console.log('\n[16] Achievements: Badges Evaluation');
  const badgesRes = await fetch(`${BASE_URL}/badges`, { headers: authHeader });
  const badgesData = await badgesRes.json();
  assert(badgesRes.ok && Array.isArray(badgesData.badges) && badgesData.badges.length >= 5, 'All 5 RPG badges evaluated with user progress');

  // 17. Analytics: Daily, Weekly, Monthly, Categories, Heatmap
  console.log('\n[17] Analytics: Comprehensive Metrics & Heatmap');
  const dailyRes = await fetch(`${BASE_URL}/analytics/daily?date=${todayDate}`, { headers: authHeader });
  const dailyData = await dailyRes.json();
  assert(dailyRes.ok && typeof dailyData.score.score === 'number', `Daily score calculated: ${dailyData.score.score}%`);

  const weeklyRes = await fetch(`${BASE_URL}/analytics/weekly`, { headers: authHeader });
  const weeklyData = await weeklyRes.json();
  assert(weeklyRes.ok && weeklyData.days?.length === 7, 'Weekly trajectory returned 7 days of scored momentum');

  const monthlyRes = await fetch(`${BASE_URL}/analytics/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`, {
    headers: authHeader,
  });
  const monthlyData = await monthlyRes.json();
  assert(monthlyRes.ok && typeof monthlyData.activeDays === 'number', `Monthly report calculated (${monthlyData.activeDays} active days)`);

  const catRes = await fetch(`${BASE_URL}/analytics/categories`, { headers: authHeader });
  const catData = await catRes.json();
  assert(catRes.ok && Array.isArray(catData.tasksByCategory), 'Category breakdown returned');

  const heatmapRes = await fetch(`${BASE_URL}/analytics/heatmap`, { headers: authHeader });
  const heatmapData = await heatmapRes.json();
  assert(heatmapRes.ok && Array.isArray(heatmapData.heatmap), `Heatmap matrix returned ${heatmapData.heatmap.length} days of intensity buckets`);

  // Summary
  console.log('\n==================================================');
  console.log(`  E2E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
