import React, { useState, useEffect } from 'react';
import { streakApi, analyticsApi } from '../services/api';
import HeatmapGrid from '../components/common/HeatmapGrid';
import StatCard from '../components/common/StatCard';
import { Flame, Calendar, Trophy, Zap, Shield, Sparkles } from 'lucide-react';

export default function StreaksPage() {
  const [streakData, setStreakData] = useState(null);
  const [heatmapActivities, setHeatmapActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [streakRes, heatRes] = await Promise.allSettled([
          streakApi.get(),
          analyticsApi.getHeatmap(),
        ]);

        if (streakRes.status === 'fulfilled' && streakRes.value.data?.streak) {
          setStreakData(streakRes.value.data.streak);
        }

        if (heatRes.status === 'fulfilled' && heatRes.value.data?.heatmap) {
          setHeatmapActivities(heatRes.value.data.heatmap);
        }
      } catch (err) {
        setError('Failed to fetch streak & heatmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalActiveDays = heatmapActivities.filter((a) => (a.activity_points || 0) > 0).length;
  const totalPoints = heatmapActivities.reduce((sum, a) => sum + (a.activity_points || 0), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Streak & Contribution Matrix
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          365-day proof of work, active streaks, and discipline consistency
        </p>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Streak Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Current Streak"
          value={`${streakData?.current_streak || 0} Days`}
          subtext="Maintained consecutively"
          icon={Flame}
          color="#f59e0b"
        />
        <StatCard
          title="Longest Historical Streak"
          value={`${streakData?.longest_streak || 0} Days`}
          subtext="Personal best record"
          icon={Trophy}
          color="#10b981"
        />
        <StatCard
          title="Total Active Days"
          value={`${totalActiveDays} Days`}
          subtext="Days with recorded activity"
          icon={Calendar}
          color="#6366f1"
        />
        <StatCard
          title="Cumulative Activity Points"
          value={totalPoints}
          subtext="Tasks + Habits + Pomodoros"
          icon={Zap}
          color="#ec4899"
        />
      </div>

      {/* 365-Day Contribution Heatmap Card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>365-Day Activity Heatmap</h3>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Real daily points from tasks (+10), habits (+15), and focus (+1/min)
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading heatmap matrix...
          </div>
        ) : (
          <HeatmapGrid activities={heatmapActivities} />
        )}
      </div>

      {/* Mechanics Explanation Card */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Shield size={18} color="var(--color-primary)" />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Intensity Bucket Calibration</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Bucket 0 (0 pts)</strong>
            Rest day with no recorded tasks, habits, or focus sessions.
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>Bucket 1 (1-25 pts)</strong>
            Completed 1-2 tasks or logged a morning habit.
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: '#10b981', display: 'block', marginBottom: '4px' }}>Bucket 2 (26-50 pts)</strong>
            Solid steady progress: multiple tasks and focus blocks.
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: '#059669', display: 'block', marginBottom: '4px' }}>Bucket 3 (51-75 pts)</strong>
            High output: completed timetable blocks and habits.
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: '#6366f1', display: 'block', marginBottom: '4px' }}>Bucket 4 (76+ pts)</strong>
            Legendary deep work day! Maximum XP gain.
          </div>
        </div>
      </div>
    </div>
  );
}
