import React from 'react';
import { CheckCircle2, Circle, Flame, Trash2 } from 'lucide-react';
import StreakStrip from './StreakStrip';

export default function HabitCard({ habit, onLogCompletion, onDelete }) {
  const isDoneToday = habit.completed_today || habit.today_completed;

  return (
    <div
      className="glass-card glass-card-hover"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onLogCompletion && onLogCompletion(habit.id, !isDoneToday)}
            className="btn-ghost"
            style={{
              padding: '2px',
              color: isDoneToday ? 'var(--color-success)' : 'var(--text-dim)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title={isDoneToday ? 'Completed today (+25 XP awarded)' : 'Click to complete for today (+25 XP)'}
          >
            {isDoneToday ? <CheckCircle2 size={24} color="var(--color-success)" /> : <Circle size={24} />}
          </button>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {habit.title}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                {habit.category || 'General'}
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
                {habit.frequency || 'daily'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Habit streak badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
            title={`Current streak: ${habit.streak_count || habit.current_streak || 0} days`}
          >
            <Flame size={14} fill="#f59e0b" />
            <span>{habit.streak_count || habit.current_streak || 0}d</span>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(habit.id)}
              className="btn-ghost"
              style={{ padding: '0.35rem', color: 'var(--color-danger)' }}
              title="Delete Habit"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 7-day strip footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Past 7 Days
        </span>
        <StreakStrip logs={habit.recent_logs || []} totalDays={7} />
      </div>
    </div>
  );
}
