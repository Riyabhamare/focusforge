import React from 'react';
import { Clock, Trash2, Edit } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WeeklyGrid({ blocksByDay = {}, onEditBlock, onDeleteBlock }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}
    >
      {DAYS.map((dayName, dayIdx) => {
        const blocks = Array.isArray(blocksByDay[dayIdx]) ? blocksByDay[dayIdx] : [];
        const isToday = new Date().getDay() === dayIdx;

        return (
          <div
            key={dayIdx}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
              borderTop: isToday ? '3px solid var(--color-primary)' : '1px solid var(--border-card)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {dayName}
                </h4>
                {isToday && (
                  <span className="badge badge-primary" style={{ fontSize: '0.625rem' }}>
                    Today
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {blocks.length} blocks
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
              {blocks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
                  No blocks scheduled
                </div>
              ) : (
                blocks.map((block) => (
                  <div
                    key={block.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      borderLeft: `4px solid ${block.color || 'var(--color-primary)'}`,
                      borderTop: '1px solid var(--border-subtle)',
                      borderRight: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                        {block.title}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                        {onEditBlock && (
                          <button
                            onClick={() => onEditBlock(block)}
                            className="btn-ghost"
                            style={{ padding: '2px', color: 'var(--text-muted)' }}
                            title="Edit Block"
                          >
                            <Edit size={13} />
                          </button>
                        )}
                        {onDeleteBlock && (
                          <button
                            onClick={() => onDeleteBlock(block.id)}
                            className="btn-ghost"
                            style={{ padding: '2px', color: 'var(--color-danger)' }}
                            title="Delete Block"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        <span>
                          {block.start_time?.slice(0, 5)} - {block.end_time?.slice(0, 5)}
                        </span>
                      </div>
                      <span style={{ fontWeight: 600, color: block.color || 'var(--color-primary)' }}>
                        {block.category}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
