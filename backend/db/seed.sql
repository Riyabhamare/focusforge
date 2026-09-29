-- FocusForge Seed Data

-- Badges
INSERT INTO badges (id, key, name, description, icon) VALUES
(1, 'early_bird', 'Early Bird', 'Completed 10 morning habit logs before 9am', 'sunrise'),
(2, 'consistent', 'Consistent Crusader', 'Maintained a 30-day active streak', 'flame'),
(3, 'focus_master', 'Focus Master', 'Completed 1,000 cumulative Pomodoro minutes', 'clock'),
(4, 'century_club', 'Century Club', 'Completed 100 tasks', 'trophy'),
(5, 'first_week', 'First Week Champion', 'Completed 7 consecutive active days', 'calendar');

-- Demo User (email: demo@focusforge.app, password: password123)
-- bcrypt hash for 'password123': $2a$10$jSTUjpvFW9U3R3Cl9B74mO0UqI9vJ8sSwNtlCA3M1plmuClRMgnca
INSERT INTO users (id, name, email, password_hash, avatar, xp, level, created_at) VALUES
(1, 'Alex Rivers', 'demo@focusforge.app', '$2a$10$jSTUjpvFW9U3R3Cl9B74mO0UqI9vJ8sSwNtlCA3M1plmuClRMgnca', 'warrior', 1250, 3, '2026-06-01 08:00:00');

-- Streaks
INSERT INTO streaks (id, user_id, current_streak, longest_streak, last_active_date) VALUES
(1, 1, 12, 18, '2026-09-09');

-- Tasks (~10 tasks)
INSERT INTO tasks (id, user_id, title, description, category, priority, status, due_date, estimated_minutes, completed_at) VALUES
(1, 1, 'Complete WTL Final Project Backend', 'Build dual DB adapter, controllers, models, and routes.', 'Coding', 'high', 'in_progress', '2026-09-10', 120, NULL),
(2, 1, 'Review Database Schema Design', 'Verify foreign key relationships and index structures.', 'Coding', 'high', 'completed', '2026-09-08', 45, '2026-09-08 14:30:00'),
(3, 1, 'Read Chapter 4 of OS Textbook', 'Focus on process synchronization and mutex locks.', 'Study', 'medium', 'pending', '2026-09-11', 60, NULL),
(4, 1, 'Morning 5K Jog', 'Track pace and heart rate.', 'Health', 'low', 'completed', '2026-09-09', 30, '2026-09-09 07:15:00'),
(5, 1, 'Prepare Presentation Slides', 'Create 10 slides for team review.', 'Work', 'high', 'pending', '2026-09-12', 90, NULL),
(6, 1, 'Refactor Gamification Utility', 'Ensure level formula formula matches specifications.', 'Coding', 'medium', 'completed', '2026-09-07', 50, '2026-09-07 16:00:00'),
(7, 1, 'Weekly Grocery Shopping', 'Buy fruits, vegetables, and meal prep essentials.', 'General', 'low', 'completed', '2026-09-06', 40, '2026-09-06 18:00:00'),
(8, 1, 'Deep Work Session: Analytics', 'Draft daily productivity score calculation.', 'Coding', 'high', 'completed', '2026-09-09', 60, '2026-09-09 11:00:00'),
(9, 1, 'Meditation & Stretching', '15 mins mindfulness before sleep.', 'Health', 'low', 'pending', '2026-09-09', 15, NULL),
(10, 1, 'Organize Workspace Desk', 'Clean monitors and organize cables.', 'General', 'low', 'pending', '2026-09-13', 25, NULL);

-- Habits (5 habits)
INSERT INTO habits (id, user_id, title, category, frequency, target_count, created_at) VALUES
(1, 1, 'Morning Drink Water (1L)', 'Health', 'daily', 1, '2026-06-01 00:00:00'),
(2, 1, 'Read 20 Pages', 'Study', 'daily', 1, '2026-06-01 00:00:00'),
(3, 1, 'Code for 1 Hour', 'Coding', 'daily', 1, '2026-06-01 00:00:00'),
(4, 1, 'Evening Review', 'Productivity', 'daily', 1, '2026-06-01 00:00:00'),
(5, 1, 'Weekly Meal Prep', 'Health', 'weekly', 1, '2026-06-01 00:00:00');

-- Habit Logs (sampled over recent weeks)
INSERT INTO habit_logs (habit_id, date, completed) VALUES
(1, '2026-09-01', 1), (2, '2026-09-01', 1), (3, '2026-09-01', 1),
(1, '2026-09-02', 1), (3, '2026-09-02', 1), (4, '2026-09-02', 1),
(1, '2026-09-03', 1), (2, '2026-09-03', 1), (3, '2026-09-03', 1), (4, '2026-09-03', 1),
(1, '2026-09-04', 1), (3, '2026-09-04', 1),
(1, '2026-09-05', 1), (2, '2026-09-05', 1), (3, '2026-09-05', 1),
(1, '2026-09-06', 1), (3, '2026-09-06', 1), (5, '2026-09-06', 1),
(1, '2026-09-07', 1), (2, '2026-09-07', 1), (3, '2026-09-07', 1), (4, '2026-09-07', 1),
(1, '2026-09-08', 1), (3, '2026-09-08', 1),
(1, '2026-09-09', 1), (2, '2026-09-09', 1), (3, '2026-09-09', 1);

-- Timetable Blocks for Full Week (0 = Sun, 1 = Mon, ..., 6 = Sat)
INSERT INTO timetable_blocks (user_id, day_of_week, start_time, end_time, category, color, title) VALUES
-- Sunday
(1, 0, '09:00', '10:30', 'Health', '#10B981', 'Weekly Planning & Prep'),
(1, 0, '14:00', '16:00', 'Coding', '#4F46E5', 'Open Source Contribution'),
-- Monday
(1, 1, '08:00', '09:00', 'Health', '#10B981', 'Morning Workout'),
(1, 1, '09:30', '12:00', 'Coding', '#4F46E5', 'Backend Architecture'),
(1, 1, '14:00', '16:00', 'Study', '#F59E0B', 'WTL Coursework'),
-- Tuesday
(1, 2, '08:30', '09:30', 'Study', '#F59E0B', 'Technical Reading'),
(1, 2, '10:00', '12:30', 'Coding', '#4F46E5', 'Feature Implementation'),
(1, 2, '15:00', '17:00', 'Work', '#EF4444', 'Project Sync'),
-- Wednesday
(1, 3, '08:00', '09:00', 'Health', '#10B981', 'Running'),
(1, 3, '10:00', '13:00', 'Coding', '#4F46E5', 'Database Optimization'),
(1, 3, '15:00', '16:30', 'Study', '#F59E0B', 'OS Problem Set'),
-- Thursday
(1, 4, '09:00', '11:30', 'Coding', '#4F46E5', 'API Refactoring'),
(1, 4, '13:30', '15:30', 'Work', '#EF4444', 'Team Review'),
-- Friday
(1, 5, '08:30', '09:30', 'Health', '#10B981', 'Yoga'),
(1, 5, '10:00', '13:00', 'Coding', '#4F46E5', 'Testing & Verification'),
(1, 5, '15:00', '17:00', 'General', '#8B5CF6', 'Weekly Retro'),
-- Saturday
(1, 6, '10:00', '12:00', 'Study', '#F59E0B', 'Elective Subject Reading'),
(1, 6, '14:00', '16:00', 'General', '#8B5CF6', 'Side Project Experimentation');

-- Goals (2 goals)
INSERT INTO goals (id, user_id, title, description, target_date, status, progress_percent, created_at) VALUES
(1, 1, 'Master Express & Dual-Mode DB Architecture', 'Build a production-grade backend with MySQL and SQLite dual driver support.', '2026-09-30', 'in_progress', 75, '2026-09-01 00:00:00'),
(2, 1, 'Maintain 30-Day Productivity Streak', 'Log tasks, habits, and pomodoro focus daily without missing a day.', '2026-10-15', 'in_progress', 40, '2026-09-01 00:00:00');

-- Notes
INSERT INTO notes (id, user_id, title, content_markdown, linked_task_id, linked_goal_id, tags, created_at, updated_at) VALUES
(1, 1, 'Database Dual Mode Adapter Design', '### Dual Mode Strategy\n- Use `mysql2/promise` when host is reachable.\n- Fallback to `better-sqlite3` on connection timeout.\n- Abstract driver queries via helper functions.', 1, 1, 'backend,architecture,database', '2026-09-08 10:00:00', '2026-09-08 10:00:00'),
(2, 1, 'Gamification Formulas', 'XP Rules:\n- Task = 10 XP\n- Habit = 25 XP\n- Goal = 50 XP\n- Full Day = 100 XP\n\nLevel Formula:\n`Level(XP) = floor(1 + sqrt(XP / 250))`', NULL, 1, 'gamification,formula', '2026-09-09 09:00:00', '2026-09-09 09:00:00');

-- Calendar Events
INSERT INTO calendar_events (id, user_id, title, date, time, type, ref_id) VALUES
(1, 1, 'WTL Final Project Sprint Review', '2026-09-15', '14:00', 'event', NULL),
(2, 1, 'Complete WTL Final Project Backend', '2026-09-10', '23:59', 'task', 1),
(3, 1, 'Morning 5K Jog', '2026-09-09', '07:00', 'habit', 4);

-- Pomodoro Sessions
INSERT INTO pomodoro_sessions (id, user_id, started_at, duration_minutes, task_id) VALUES
(1, 1, '2026-09-09 10:00:00', 25, 1),
(2, 1, '2026-09-09 10:30:00', 25, 1),
(3, 1, '2026-09-09 11:00:00', 25, 8),
(4, 1, '2026-09-08 14:00:00', 25, 2),
(5, 1, '2026-09-08 14:30:00', 25, 2);

-- User Badges (User 1 has unlocked 'first_week')
INSERT INTO user_badges (id, user_id, badge_id, unlocked_at) VALUES
(1, 1, 5, '2026-09-07 20:00:00');

-- XP Log
INSERT INTO xp_log (id, user_id, amount, reason, created_at) VALUES
(1, 1, 10, 'Completed task: Review Database Schema Design', '2026-09-08 14:30:00'),
(2, 1, 25, 'Completed habit: Code for 1 Hour', '2026-09-08 18:00:00'),
(3, 1, 10, 'Completed task: Deep Work Session: Analytics', '2026-09-09 11:00:00'),
(4, 1, 25, 'Completed habit: Morning Drink Water', '2026-09-09 08:00:00');
