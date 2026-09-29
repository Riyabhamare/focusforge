const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const streakRoutes = require('./routes/streakRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const goalRoutes = require('./routes/goalRoutes');
const noteRoutes = require('./routes/noteRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const pomodoroRoutes = require('./routes/pomodoroRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Healthcheck
app.get('/api/health', (req, res) => {
  const db = require('./config/db');
  res.json({
    status: 'ok',
    appName: 'FocusForge API',
    dbMode: db.getMode() || 'initializing',
    timestamp: new Date().toISOString()
  });
});

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/user', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;
