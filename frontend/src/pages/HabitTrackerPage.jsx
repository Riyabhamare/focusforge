import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { habitApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import HabitCard from '../components/habits/HabitCard';
import { Plus, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HabitTrackerPage() {
  const { handleReward } = useGamification();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHabits = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await habitApi.getAll();
      if (res.data?.habits) {
        setHabits(res.data.habits);
      }
    } catch (err) {
      setError('Failed to fetch habit routines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleLogCompletion = async (habitId, completed) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await habitApi.logCompletion(habitId, {
        date: todayStr,
        completed: completed ? 1 : 0,
      });

      if (res.data?.gamification) {
        handleReward(res.data.gamification);
      }

      // Update local state
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id === habitId) {
            const curStreak = h.streak_count || h.current_streak || 0;
            return {
              ...h,
              completed_today: completed,
              today_completed: completed,
              streak_count: completed ? curStreak + 1 : Math.max(0, curStreak - 1),
            };
          }
          return h;
        })
      );
    } catch (err) {
      console.error('Failed to log habit completion:', err);
    }
  };

  const handleDelete = async (habitId) => {
    if (!window.confirm('Delete this habit routine?')) return;
    try {
      await habitApi.delete(habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    } catch (err) {
      alert('Failed to delete habit');
    }
  };

  const completedTodayCount = habits.filter((h) => h.completed_today || h.today_completed).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Daily Habit Crucible
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {completedTodayCount} of {habits.length} rituals completed today (+25 XP per habit)
          </p>
        </div>

        <Link to="/habits/new" className="btn btn-primary">
          <Plus size={18} /> Forge New Habit
        </Link>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading daily habits...
        </div>
      ) : habits.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Flame size={48} color="#f59e0b" style={{ margin: '0 auto 1rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Active Habit Rituals
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Consistency is the secret to greatness. Forge your first daily habit today.
          </p>
          <Link to="/habits/new" className="btn btn-primary">
            <Plus size={16} /> Create Habit Ritual
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem', width: '100%' }}>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onLogCompletion={handleLogCompletion}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
