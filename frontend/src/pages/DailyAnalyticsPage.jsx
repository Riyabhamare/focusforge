import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import DailyChart from '../components/analytics/DailyChart';
import StatCard from '../components/common/StatCard';
import { Calendar, BarChart2, CheckCircle2, Clock, Zap } from 'lucide-react';

export default function DailyAnalyticsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDaily = async (date) => {
    setLoading(true);
    setError('');
    try {
      const res = await analyticsApi.getDaily(date);
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch daily analytics breakdown');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily(selectedDate);
  }, [selectedDate]);

  const score = data?.score?.score ?? 0;
  const breakdown = data?.score?.breakdown;
  const details = data?.details;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Daily Productivity Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Multi-factor scoring breakdown based on tasks, habits, schedule, and focus
          </p>
        </div>

        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--color-primary)" />
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', padding: '0.5rem 0.875rem' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Analyzing productivity parameters...
        </div>
      ) : (
        <>
          {/* Main Score Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <StatCard
              title="Overall Score"
              value={`${score}%`}
              subtext="Weighted aggregate rating"
              icon={Zap}
              color="var(--color-primary)"
            />
            <StatCard
              title="Tasks Adherence"
              value={`${breakdown?.sTasks || 0}%`}
              subtext={`${breakdown?.completedTasks || 0} completed / ${breakdown?.plannedTasks || 0} planned`}
              icon={CheckCircle2}
              color="#6366f1"
            />
            <StatCard
              title="Habit Completion"
              value={`${breakdown?.sHabits || 0}%`}
              subtext={`${breakdown?.completedHabits || 0} completed / ${breakdown?.totalHabits || 0} active`}
              icon={Clock}
              color="#10b981"
            />
            <StatCard
              title="Pomodoro Focus"
              value={`${breakdown?.focusMinutes || 0}m`}
              subtext={`${breakdown?.sPomodoro || 0}% of 120m target`}
              icon={BarChart2}
              color="#ec4899"
            />
          </div>

          {/* Bar Chart Breakdown */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>
              Pillar Breakdown (Tasks 40% • Habits 30% • Timetable 15% • Focus 15%)
            </h3>
            <DailyChart breakdown={breakdown} />
          </div>

          {/* Activity Logs on Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', width: '100%' }}>
            {/* Completed Tasks */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--color-primary)" /> Tasks On Date ({details?.tasks?.length || 0})
              </h4>
              {details?.tasks?.length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', padding: '1rem 0' }}>
                  No tasks recorded for this date.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {details?.tasks?.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        padding: '0.6rem 0.75rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{t.title}</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.625rem' }}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Habit Logs */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="#10b981" /> Habits Logged ({details?.habits?.length || 0})
              </h4>
              {details?.habits?.length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', padding: '1rem 0' }}>
                  No habit completions logged for this date.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {details?.habits?.map((h) => (
                    <div
                      key={h.id}
                      style={{
                        padding: '0.6rem 0.75rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{h.title}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>Completed</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
