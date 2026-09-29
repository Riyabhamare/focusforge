import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function WeeklyTrend({ days = [] }) {
  if (!days || days.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No weekly activity data available yet.
      </div>
    );
  }

  const formattedData = days.map((d) => ({
    date: d.date ? d.date.slice(5) : '', // MM-DD
    score: d.score ?? 0,
    focusMins: d.breakdown?.focusMinutes ?? 0,
    tasks: d.breakdown?.completedTasks ?? 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.8125rem',
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Date: {label}
          </p>
          <p style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Productivity Score: {payload[0].value}%
          </p>
          <p style={{ color: '#ec4899', fontSize: '0.75rem' }}>
            Focus: {payload[0].payload.focusMins} mins
          </p>
          <p style={{ color: '#10b981', fontSize: '0.75rem' }}>
            Completed Tasks: {payload[0].payload.tasks}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="date"
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
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--color-primary)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
