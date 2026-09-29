import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, CheckSquare, Sparkles, ArrowRight } from 'lucide-react';

export default function TodaySummary({ dailyScore, tasks = [], habits = [], onCompleteTask }) {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'done').slice(0, 4);
  const score = dailyScore?.score?.score ?? (dailyScore?.score ?? 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', width: '100%' }}>
      {/* Productivity Score Card */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: `conic-gradient(var(--color-primary) ${score * 3.6}deg, var(--border-subtle) 0deg)`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '78px',
              height: '78px',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {Math.round(score)}
            </span>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Score
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8125rem' }}>
            <Sparkles size={14} /> TODAY'S PRODUCTIVITY
          </div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.25rem 0' }}>
            {score >= 80 ? 'Exceptional Focus!' : score >= 50 ? 'Steady Progress' : 'Warm-up Phase'}
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Adhering to timetable blocks and logging habits boosts your daily forge multiplier.
          </p>
          <Link
            to="/analytics/daily"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginTop: '0.5rem',
            }}
          >
            View daily breakdown <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Today's Priority Tasks Card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={18} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Priority Queue</h4>
          </div>
          <Link to="/tasks/today" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            All Today ({tasks.length})
          </Link>
        </div>

        {pendingTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            🎉 All scheduled tasks for today are completed!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                  <button
                    onClick={() => onCompleteTask && onCompleteTask(task.id)}
                    className="btn-ghost"
                    style={{ padding: '2px', color: 'var(--text-muted)' }}
                    title="Mark Complete (+10 XP)"
                  >
                    <Circle size={18} />
                  </button>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {task.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <span
                    className={`badge ${
                      task.priority === 'high' ? 'badge-danger' : task.priority === 'medium' ? 'badge-warning' : 'badge-primary'
                    }`}
                    style={{ fontSize: '0.6875rem' }}
                  >
                    {task.priority || 'medium'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
