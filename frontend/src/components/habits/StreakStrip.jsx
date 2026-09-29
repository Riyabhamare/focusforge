import React from 'react';

export default function StreakStrip({ logs = [], totalDays = 7 }) {
  // Generate last N days
  const days = React.useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('default', { weekday: 'narrow' });
      const isCompleted = logs.some((l) => l.date === dateStr && (l.completed === 1 || l.completed === true));
      list.push({
        date: dateStr,
        dayName,
        isToday: i === 0,
        isCompleted,
      });
    }
    return list;
  }, [logs, totalDays]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {days.map((day, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
          }}
          title={`${day.date}: ${day.isCompleted ? 'Completed' : 'Missed'}`}
        >
          <span style={{ fontSize: '0.625rem', color: day.isToday ? 'var(--color-primary)' : 'var(--text-dim)', fontWeight: day.isToday ? 700 : 500 }}>
            {day.dayName}
          </span>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              background: day.isCompleted ? 'var(--color-success)' : 'var(--border-subtle)',
              border: day.isToday ? '1px solid var(--color-primary)' : '1px solid transparent',
              boxShadow: day.isCompleted ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 150ms ease',
            }}
          />
        </div>
      ))}
    </div>
  );
}
