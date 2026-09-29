import React, { useState } from 'react';

export default function HeatmapGrid({ activities = [] }) {
  const [tooltip, setTooltip] = useState(null);

  // Map activities by date 'YYYY-MM-DD'
  const activityMap = React.useMemo(() => {
    const map = {};
    if (Array.isArray(activities)) {
      activities.forEach((item) => {
        if (item.date) {
          map[item.date] = {
            points: item.activity_points ?? 0,
            bucket: item.intensity_bucket ?? 0,
          };
        }
      });
    }
    return map;
  }, [activities]);

  // Generate 52 weeks (364 days) up to current date
  const { weeks, monthLabels } = React.useMemo(() => {
    const today = new Date();
    const days = [];
    const totalDays = 52 * 7;

    // Determine start date
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    const labels = [];
    let currentMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0 is Sun

      const month = d.getMonth();
      if (month !== currentMonth && dayOfWeek === 0) {
        currentMonth = month;
        labels.push({
          weekIndex: Math.floor(i / 7),
          label: d.toLocaleString('default', { month: 'short' }),
        });
      }

      const act = activityMap[dateStr] || { points: 0, bucket: 0 };
      days.push({
        date: dateStr,
        dayOfWeek,
        points: act.points,
        bucket: act.bucket,
      });
    }

    // Split into columns of 7 days
    const weekCols = [];
    for (let i = 0; i < days.length; i += 7) {
      weekCols.push(days.slice(i, i + 7));
    }

    return { weeks: weekCols, monthLabels: labels };
  }, [activityMap]);

  const getColor = (bucket) => {
    switch (bucket) {
      case 1:
        return 'var(--heatmap-1)';
      case 2:
        return 'var(--heatmap-2)';
      case 3:
        return 'var(--heatmap-3)';
      case 4:
        return 'var(--heatmap-4)';
      default:
        return 'var(--heatmap-0)';
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ position: 'relative', overflowX: 'auto', padding: '1rem 0' }}>
      {/* Month Labels */}
      <div style={{ display: 'flex', marginLeft: '32px', marginBottom: '6px', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
        {monthLabels.map((m, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${32 + m.weekIndex * 14}px`,
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
        {/* Day of Week Labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '6px' }}>
          {dayNames.map((day, idx) => (
            <div
              key={idx}
              style={{
                height: '11px',
                fontSize: '0.625rem',
                color: 'var(--text-dim)',
                lineHeight: '11px',
                visibility: idx % 2 === 1 ? 'visible' : 'hidden',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  style={{
                    width: '11px',
                    height: '11px',
                    borderRadius: '2px',
                    backgroundColor: getColor(day.bucket),
                    border: day.bucket > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    cursor: 'pointer',
                    transition: 'transform 100ms ease',
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    setTooltip({
                      date: day.date,
                      points: day.points,
                      bucket: day.bucket,
                      x: rect.left + window.scrollX,
                      y: rect.top + window.scrollY - 36,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translateX(-50%)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            color: 'var(--text-main)',
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap',
          }}
        >
          <strong>{tooltip.points} points</strong> on {tooltip.date}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '6px',
          marginTop: '12px',
          fontSize: '0.6875rem',
          color: 'var(--text-dim)',
        }}
      >
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((b) => (
          <div
            key={b}
            style={{
              width: '11px',
              height: '11px',
              borderRadius: '2px',
              backgroundColor: getColor(b),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
