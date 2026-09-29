-- FocusForge MySQL Database Schema & Initial Seed Data
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.4+ (XAMPP default)
-- Designed for direct import in phpMyAdmin or mysql CLI

CREATE DATABASE IF NOT EXISTS `focusforge` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `focusforge`;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT 'warrior',
  `xp` INT DEFAULT 0,
  `level` INT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `tasks`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(50) DEFAULT 'general',
  `priority` VARCHAR(20) DEFAULT 'medium',
  `status` VARCHAR(20) DEFAULT 'pending',
  `due_date` VARCHAR(20) DEFAULT NULL,
  `estimated_minutes` INT DEFAULT 30,
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tasks_user` (`user_id`),
  INDEX `idx_tasks_status` (`status`),
  INDEX `idx_tasks_due_date` (`due_date`),
  CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `habits`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `habits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'health',
  `frequency` VARCHAR(20) DEFAULT 'daily',
  `target_count` INT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_habits_user` (`user_id`),
  CONSTRAINT `fk_habits_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `habit_logs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `habit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `habit_id` INT NOT NULL,
  `date` VARCHAR(10) NOT NULL,
  `completed` INT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_habit_date` (`habit_id`, `date`),
  INDEX `idx_habit_logs_date` (`date`),
  CONSTRAINT `fk_habit_logs_habit` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `streaks`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `streaks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `current_streak` INT DEFAULT 0,
  `longest_streak` INT DEFAULT 0,
  `last_active_date` VARCHAR(10) DEFAULT NULL,
  CONSTRAINT `fk_streaks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `daily_activity`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `daily_activity` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `date` VARCHAR(10) NOT NULL,
  `activity_points` INT DEFAULT 0,
  `intensity_bucket` INT DEFAULT 0,
  UNIQUE KEY `unique_user_date` (`user_id`, `date`),
  INDEX `idx_daily_act_user_date` (`user_id`, `date`),
  CONSTRAINT `fk_daily_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `timetable_blocks`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `timetable_blocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `day_of_week` INT NOT NULL,
  `start_time` VARCHAR(10) NOT NULL,
  `end_time` VARCHAR(10) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'study',
  `color` VARCHAR(20) DEFAULT '#4F46E5',
  `title` VARCHAR(255) NOT NULL,
  INDEX `idx_timetable_user_day` (`user_id`, `day_of_week`),
  CONSTRAINT `fk_timetable_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `goals`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `goals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `target_date` VARCHAR(20) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'in_progress',
  `progress_percent` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_goals_user` (`user_id`),
  CONSTRAINT `fk_goals_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `notes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content_markdown` TEXT NULL,
  `linked_task_id` INT DEFAULT NULL,
  `linked_goal_id` INT DEFAULT NULL,
  `tags` VARCHAR(255) DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_notes_user` (`user_id`),
  CONSTRAINT `fk_notes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `calendar_events`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(10) NOT NULL,
  `time` VARCHAR(10) DEFAULT NULL,
  `type` VARCHAR(20) DEFAULT 'event',
  `ref_id` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cal_user_date` (`user_id`, `date`),
  CONSTRAINT `fk_cal_events_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `pomodoro_sessions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pomodoro_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `started_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `duration_minutes` INT DEFAULT 25,
  `task_id` INT DEFAULT NULL,
  INDEX `idx_pom_user` (`user_id`),
  CONSTRAINT `fk_pomodoro_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `badges`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `badges` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `user_badges`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_badges` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `badge_id` INT NOT NULL,
  `unlocked_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_badge` (`user_id`, `badge_id`),
  INDEX `idx_user_badges_user` (`user_id`),
  CONSTRAINT `fk_user_badges_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_badges_badge` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `xp_log`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `xp_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_xp_log_user` (`user_id`),
  CONSTRAINT `fk_xp_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Badges
INSERT INTO `badges` (`id`, `key`, `name`, `description`, `icon`) VALUES
(1, 'early_bird', 'Early Bird', 'Completed 10 morning habit logs before 9am', 'sunrise'),
(2, 'consistent', 'Consistent Crusader', 'Maintained a 30-day active streak', 'flame'),
(3, 'focus_master', 'Focus Master', 'Completed 1,000 cumulative Pomodoro minutes', 'clock'),
(4, 'century_club', 'Century Club', 'Completed 100 tasks', 'trophy'),
(5, 'first_week', 'First Week Champion', 'Completed 7 consecutive active days', 'calendar')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Demo User (email: demo@focusforge.app, password: password123)
-- bcrypt hash for 'password123': $2a$10$jSTUjpvFW9U3R3Cl9B74mO0UqI9vJ8sSwNtlCA3M1plmuClRMgnca
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `avatar`, `xp`, `level`, `created_at`) VALUES
(1, 'Alex Rivers', 'demo@focusforge.app', '$2a$10$jSTUjpvFW9U3R3Cl9B74mO0UqI9vJ8sSwNtlCA3M1plmuClRMgnca', 'warrior', 1250, 3, '2026-06-01 08:00:00')
ON DUPLICATE KEY UPDATE `email`=VALUES(`email`);

-- Streaks
INSERT INTO `streaks` (`id`, `user_id`, `current_streak`, `longest_streak`, `last_active_date`) VALUES
(1, 1, 12, 18, '2026-09-09')
ON DUPLICATE KEY UPDATE `current_streak`=VALUES(`current_streak`);

-- Tasks
INSERT INTO `tasks` (`id`, `user_id`, `title`, `description`, `category`, `priority`, `status`, `due_date`, `estimated_minutes`, `completed_at`) VALUES
(1, 1, 'Complete WTL Final Project Backend', 'Build PHP PDO REST APIs, MySQL schema, and connect to frontend.', 'Coding', 'high', 'in_progress', '2026-09-10', 120, NULL),
(2, 1, 'Review Database Schema Design', 'Verify foreign key relationships and index structures.', 'Coding', 'high', 'completed', '2026-09-08', 45, '2026-09-08 14:30:00'),
(3, 1, 'Read Chapter 4 of OS Textbook', 'Focus on process synchronization and mutex locks.', 'Study', 'medium', 'pending', '2026-09-11', 60, NULL),
(4, 1, 'Morning 5K Jog', 'Track pace and heart rate.', 'Health', 'low', 'completed', '2026-09-09', 30, '2026-09-09 07:15:00'),
(5, 1, 'Prepare Presentation Slides', 'Create 10 slides for team review.', 'Work', 'high', 'pending', '2026-09-12', 90, NULL),
(6, 1, 'Refactor Gamification Utility', 'Ensure level formula formula matches specifications.', 'Coding', 'medium', 'completed', '2026-09-07', 50, '2026-09-07 16:00:00'),
(7, 1, 'Weekly Grocery Shopping', 'Buy fruits, vegetables, and meal prep essentials.', 'General', 'low', 'completed', '2026-09-06', 40, '2026-09-06 18:00:00'),
(8, 1, 'Deep Work Session: Analytics', 'Draft daily productivity score calculation.', 'Coding', 'high', 'completed', '2026-09-09', 60, '2026-09-09 11:00:00'),
(9, 1, 'Meditation & Stretching', '15 mins mindfulness before sleep.', 'Health', 'low', 'pending', '2026-09-09', 15, NULL),
(10, 1, 'Organize Workspace Desk', 'Clean monitors and organize cables.', 'General', 'low', 'pending', '2026-09-13', 25, NULL)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Habits
INSERT INTO `habits` (`id`, `user_id`, `title`, `category`, `frequency`, `target_count`, `created_at`) VALUES
(1, 1, 'Morning Drink Water (1L)', 'Health', 'daily', 1, '2026-06-01 00:00:00'),
(2, 1, 'Read 20 Pages', 'Study', 'daily', 1, '2026-06-01 00:00:00'),
(3, 1, 'Code for 1 Hour', 'Coding', 'daily', 1, '2026-06-01 00:00:00'),
(4, 1, 'Evening Review', 'Productivity', 'daily', 1, '2026-06-01 00:00:00'),
(5, 1, 'Weekly Meal Prep', 'Health', 'weekly', 1, '2026-06-01 00:00:00')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Habit Logs
INSERT INTO `habit_logs` (`habit_id`, `date`, `completed`) VALUES
(1, '2026-09-01', 1), (2, '2026-09-01', 1), (3, '2026-09-01', 1),
(1, '2026-09-02', 1), (3, '2026-09-02', 1), (4, '2026-09-02', 1),
(1, '2026-09-03', 1), (2, '2026-09-03', 1), (3, '2026-09-03', 1), (4, '2026-09-03', 1),
(1, '2026-09-04', 1), (3, '2026-09-04', 1),
(1, '2026-09-05', 1), (2, '2026-09-05', 1), (3, '2026-09-05', 1),
(1, '2026-09-06', 1), (3, '2026-09-06', 1), (5, '2026-09-06', 1),
(1, '2026-09-07', 1), (2, '2026-09-07', 1), (3, '2026-09-07', 1), (4, '2026-09-07', 1),
(1, '2026-09-08', 1), (3, '2026-09-08', 1),
(1, '2026-09-09', 1), (2, '2026-09-09', 1), (3, '2026-09-09', 1)
ON DUPLICATE KEY UPDATE `completed`=VALUES(`completed`);

-- Timetable Blocks
INSERT INTO `timetable_blocks` (`id`, `user_id`, `day_of_week`, `start_time`, `end_time`, `category`, `color`, `title`) VALUES
(1, 1, 0, '09:00', '10:30', 'Health', '#10B981', 'Weekly Planning & Prep'),
(2, 1, 0, '14:00', '16:00', 'Coding', '#4F46E5', 'Open Source Contribution'),
(3, 1, 1, '08:00', '09:00', 'Health', '#10B981', 'Morning Workout'),
(4, 1, 1, '09:30', '12:00', 'Coding', '#4F46E5', 'Backend Architecture'),
(5, 1, 1, '14:00', '16:00', 'Study', '#F59E0B', 'WTL Coursework'),
(6, 1, 2, '08:30', '09:30', 'Study', '#F59E0B', 'Technical Reading'),
(7, 1, 2, '10:00', '12:30', 'Coding', '#4F46E5', 'Feature Implementation'),
(8, 1, 2, '15:00', '17:00', 'Work', '#EF4444', 'Project Sync'),
(9, 1, 3, '08:00', '09:00', 'Health', '#10B981', 'Running'),
(10, 1, 3, '10:00', '13:00', 'Coding', '#4F46E5', 'Database Optimization'),
(11, 1, 3, '15:00', '16:30', 'Study', '#F59E0B', 'OS Problem Set'),
(12, 1, 4, '09:00', '11:30', 'Coding', '#4F46E5', 'API Refactoring'),
(13, 1, 4, '13:30', '15:30', 'Work', '#EF4444', 'Team Review'),
(14, 1, 5, '08:30', '09:30', 'Health', '#10B981', 'Yoga'),
(15, 1, 5, '10:00', '13:00', 'Coding', '#4F46E5', 'Testing & Verification'),
(16, 1, 5, '15:00', '17:00', 'General', '#8B5CF6', 'Weekly Retro'),
(17, 1, 6, '10:00', '12:00', 'Study', '#F59E0B', 'Elective Subject Reading'),
(18, 1, 6, '14:00', '16:00', 'General', '#8B5CF6', 'Side Project Experimentation')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Goals
INSERT INTO `goals` (`id`, `user_id`, `title`, `description`, `target_date`, `status`, `progress_percent`, `created_at`) VALUES
(1, 1, 'Master PHP & MySQL Architecture', 'Build a production-grade fullstack web application using PHP, PDO, and MySQL in XAMPP.', '2026-09-30', 'in_progress', 85, '2026-09-01 00:00:00'),
(2, 1, 'Maintain 30-Day Productivity Streak', 'Log tasks, habits, and pomodoro focus daily without missing a day.', '2026-10-15', 'in_progress', 40, '2026-09-01 00:00:00')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Notes
INSERT INTO `notes` (`id`, `user_id`, `title`, `content_markdown`, `linked_task_id`, `linked_goal_id`, `tags`, `created_at`, `updated_at`) VALUES
(1, 1, 'PHP & MySQL Full-Stack Architecture', '### Architecture Highlights\n- PHP 8+ PDO Prepared Statements\n- MySQL / MariaDB via XAMPP\n- RESTful JSON API endpoints\n- Seamless React Frontend Integration', 1, 1, 'backend,php,mysql,architecture', '2026-09-08 10:00:00', '2026-09-08 10:00:00'),
(2, 1, 'Gamification Formulas', 'XP Rules:\n- Task = 10 XP\n- Habit = 25 XP\n- Goal = 50 XP\n- Full Day = 100 XP\n\nLevel Formula:\n`Level(XP) = floor(1 + sqrt(XP / 250))`', NULL, 1, 'gamification,formula', '2026-09-09 09:00:00', '2026-09-09 09:00:00')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Calendar Events
INSERT INTO `calendar_events` (`id`, `user_id`, `title`, `date`, `time`, `type`, `ref_id`) VALUES
(1, 1, 'WTL Final Project Sprint Review', '2026-09-15', '14:00', 'event', NULL),
(2, 1, 'Complete WTL Final Project Backend', '2026-09-10', '23:59', 'task', 1),
(3, 1, 'Morning 5K Jog', '2026-09-09', '07:00', 'habit', 4)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Pomodoro Sessions
INSERT INTO `pomodoro_sessions` (`id`, `user_id`, `started_at`, `duration_minutes`, `task_id`) VALUES
(1, 1, '2026-09-09 10:00:00', 25, 1),
(2, 1, '2026-09-09 10:30:00', 25, 1),
(3, 1, '2026-09-09 11:00:00', 25, 8),
(4, 1, '2026-09-08 14:00:00', 25, 2),
(5, 1, '2026-09-08 14:30:00', 25, 2)
ON DUPLICATE KEY UPDATE `duration_minutes`=VALUES(`duration_minutes`);

-- User Badges
INSERT INTO `user_badges` (`id`, `user_id`, `badge_id`, `unlocked_at`) VALUES
(1, 1, 5, '2026-09-07 20:00:00')
ON DUPLICATE KEY UPDATE `badge_id`=VALUES(`badge_id`);

-- XP Log
INSERT INTO `xp_log` (`id`, `user_id`, `amount`, `reason`, `created_at`) VALUES
(1, 1, 10, 'Completed task: Review Database Schema Design', '2026-09-08 14:30:00'),
(2, 1, 25, 'Completed habit: Code for 1 Hour', '2026-09-08 18:00:00'),
(3, 1, 10, 'Completed task: Deep Work Session: Analytics', '2026-09-09 11:00:00'),
(4, 1, 25, 'Completed habit: Morning Drink Water', '2026-09-09 08:00:00')
ON DUPLICATE KEY UPDATE `amount`=VALUES(`amount`);
