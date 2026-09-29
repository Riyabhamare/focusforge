import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function DailyChart({ breakdown }) {
  if (!breakdown) return null;

  const data = [
    { name: 'Tasks (40%)', score: breakdown.sTasks || 0, color: '#6366f1' },
    { name: 'Habits (30%)', score: breakdown.sHabits || 0, color: '#10b981' },
    { name: 'Timetable (15%)', score: breakdown.sTimetable || 0, color: '#f59e0b' },
    { name: 'Pomodoro (15%)', score: breakdown.sPomodoro || 0, color: '#ec4899' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.8125rem',
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
            {payload[0].payload.name}
          </p>
          <p style={{ color: payload[0].payload.color, fontWeight: 800 }}>
            Score: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
          <XAxis
            dataKey="name"
            stroke="var(--text-dim)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-subtle)' }}
          />
          <YAxis
            stroke="var(--text-dim)"
            fontSize={12}
            domain={[0, 100]}
            tickLine={false}
            axisLine={{ stroke: 'var(--border-subtle)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
