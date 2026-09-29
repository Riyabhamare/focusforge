import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckSquare, Clock, CalendarDays, Target, FileText } from 'lucide-react';

const ACTIONS = [
  { label: 'New Task', icon: Plus, path: '/tasks/new', color: '#6366f1' },
  { label: 'Today’s Tasks', icon: CheckSquare, path: '/tasks/today', color: '#10b981' },
  { label: 'Habit Tracker', icon: Clock, path: '/habits', color: '#f59e0b' },
  { label: 'Create Timetable', icon: CalendarDays, path: '/timetable/create', color: '#8b5cf6' },
  { label: 'New Milestone', icon: Target, path: '/goals', color: '#ec4899' },
  { label: 'Markdown Notes', icon: FileText, path: '/notes', color: '#06b6d4' },
];

export default function QuickActionGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
      {ACTIONS.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link
            key={idx}
            to={action.path}
            className="glass-card glass-card-hover"
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.625rem',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: `rgba(${action.color === '#6366f1' ? '99,102,241' : '16,185,129'}, 0.12)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: action.color,
              }}
            >
              <Icon size={20} />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
