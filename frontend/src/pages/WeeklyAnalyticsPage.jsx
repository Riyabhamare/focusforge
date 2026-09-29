import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import WeeklyTrend from '../components/analytics/WeeklyTrend';
import StatCard from '../components/common/StatCard';
import { TrendingUp, BarChart, Clock, CheckSquare, Sparkles } from 'lucide-react';

export default function WeeklyAnalyticsPage() {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeekly = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await analyticsApi.getWeekly();
        setWeeklyData(res.data);
      } catch (err) {
        setError('Failed to fetch weekly analytics curve');
      } finally {
        setLoading(false);
      }
    };

    fetchWeekly();
  }, []);

  const days = weeklyData?.days || [];
  const avgScore = weeklyData?.averageScore ?? 0;
  const totalWeeklyFocus = days.reduce((sum, d) => sum + (d.breakdown?.focusMinutes || 0), 0);
  const totalWeeklyTasks = days.reduce((sum, d) => sum + (d.breakdown?.completedTasks || 0), 0);
  const totalWeeklyHabits = days.reduce((sum, d) => sum + (d.breakdown?.completedHabits || 0), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Weekly Momentum Trends
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          7-day productivity curve from {weeklyData?.startDate || '...'} to {weeklyData?.endDate || '...'}
        </p>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="7-Day Average Score"
          value={`${avgScore}%`}
          subtext="Overall weekly consistency"
          icon={TrendingUp}
          color="var(--color-primary)"
        />
        <StatCard
          title="Total Focus Time"
          value={`${totalWeeklyFocus}m`}
          subtext={`${(totalWeeklyFocus / 60).toFixed(1)} focus hours`}
          icon={Clock}
          color="#ec4899"
        />
        <StatCard
          title="Tasks Completed"
          value={totalWeeklyTasks}
          subtext="Vanquished this past week"
          icon={CheckSquare}
          color="#10b981"
        />
        <StatCard
          title="Habits Logged"
          value={totalWeeklyHabits}
          subtext="Daily rituals executed"
          icon={BarChart}
          color="#f59e0b"
        />
      </div>

      {/* Recharts Curve Card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Productivity Score Trajectory</h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>7-day sliding window</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Calculating weekly trajectory...
          </div>
        ) : (
          <WeeklyTrend days={days} />
        )}
      </div>
    </div>
  );
}
