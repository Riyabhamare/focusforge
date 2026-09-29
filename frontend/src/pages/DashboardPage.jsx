import React, { useState, useEffect } from 'react';
import { taskApi, habitApi, streakApi, analyticsApi, userApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import { useAuth } from '../context/AuthContext';
import XPBar from '../components/dashboard/XPBar';
import TodaySummary from '../components/dashboard/TodaySummary';
import QuickActionGrid from '../components/dashboard/QuickActionGrid';
import StatCard from '../components/common/StatCard';
import { CheckSquare, Flame, Clock, Target, Sparkles, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser, updateUser } = useAuth();
  const { handleReward, refreshGamification } = useGamification();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [dailyAnalytics, setDailyAnalytics] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      if (refreshUser) {
        refreshUser();
      }

      const [taskRes, habitRes, statsRes, dailyRes] = await Promise.allSettled([
        taskApi.getAll({ status: 'all' }),
        habitApi.getAll(),
        userApi.getStats(),
        analyticsApi.getDaily(today),
      ]);

      if (taskRes.status === 'fulfilled' && taskRes.value.data?.tasks) {
        setTasks(taskRes.value.data.tasks);
      }
      if (habitRes.status === 'fulfilled' && habitRes.value.data?.habits) {
        setHabits(habitRes.value.data.habits);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data?.stats) {
        setStats(statsRes.value.data.stats);
        if (statsRes.value.data.stats.user && updateUser) {
          updateUser(statsRes.value.data.stats.user);
        }
      }
      if (dailyRes.status === 'fulfilled' && dailyRes.value.data) {
        setDailyAnalytics(dailyRes.value.data);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      const res = await taskApi.complete(taskId);
      if (res.data?.gamification) {
        handleReward(res.data.gamification);
      }
      // Update local task state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
      );
      // Reload stats and daily score
      const today = new Date().toISOString().split('T')[0];
      const [statsRes, dailyRes] = await Promise.allSettled([
        userApi.getStats(),
        analyticsApi.getDaily(today),
      ]);
      if (statsRes.status === 'fulfilled' && statsRes.value.data?.stats) {
        setStats(statsRes.value.data.stats);
      }
      if (dailyRes.status === 'fulfilled' && dailyRes.value.data) {
        setDailyAnalytics(dailyRes.value.data);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.due_date === todayStr || t.status === 'pending');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Hail, {user?.name || 'Warrior'}! 🛡️
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.2rem' }}>
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. Forge your discipline.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.875rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} color="#f59e0b" />
            <span>Active Realm: SQLite & MySQL Dual Engine</span>
          </div>
        </div>
      </div>

      {/* XP and Level Bar */}
      <XPBar />

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Active Streak"
          value={`${stats?.streak?.current || 0} Days`}
          subtext={`Longest: ${stats?.streak?.longest || 0} days`}
          icon={Flame}
          color="#f59e0b"
        />
        <StatCard
          title="Tasks Completed"
          value={`${stats?.tasks?.completed || 0} / ${stats?.tasks?.total || 0}`}
          subtext={`${stats?.tasks?.pending || 0} tasks pending`}
          icon={CheckSquare}
          color="#10b981"
        />
        <StatCard
          title="Habits Tracked"
          value={`${stats?.habits?.total || habits.length}`}
          subtext="Daily active rituals"
          icon={Clock}
          color="#6366f1"
        />
        <StatCard
          title="Focus Time"
          value={`${stats?.focusMinutes || 0}m`}
          subtext="Deep Pomodoro focus"
          icon={Trophy}
          color="#ec4899"
        />
      </div>

      {/* Today's Productivity Score & Priority Queue */}
      <TodaySummary
        dailyScore={dailyAnalytics}
        tasks={todayTasks}
        habits={habits}
        onCompleteTask={handleCompleteTask}
      />

      {/* Quick Actions */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.875rem' }}>
          Quick Action Matrix
        </h3>
        <QuickActionGrid />
      </div>
    </div>
  );
}
