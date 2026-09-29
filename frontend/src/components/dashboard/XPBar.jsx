import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Zap, Sparkles, Shield } from 'lucide-react';

export default function XPBar() {
  const { xp, level } = useGamification();

  // Formula: Level(XP) = floor(1 + sqrt(XP / 250))
  // Level L starts at 250*(L-1)^2
  // Next level L+1 starts at 250*L^2
  const currentLevelBaseXp = 250 * Math.pow(level - 1, 2);
  const nextLevelXp = 250 * Math.pow(level, 2);
  const xpInCurrentLevel = Math.max(0, xp - currentLevelBaseXp);
  const xpNeededForNext = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));
  const xpRemaining = Math.max(0, nextLevelXp - xp);

  const getRank = (lvl) => {
    if (lvl >= 10) return 'Mythic Titan';
    if (lvl >= 7) return 'Master Artificer';
    if (lvl >= 5) return 'Iron Grandmaster';
    if (lvl >= 3) return 'Adept Forger';
    return 'Apprentice Forger';
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        <Shield size={160} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 0 20px var(--color-primary-glow)',
            }}
          >
            {level}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Level {level}</h3>
              <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
                <Sparkles size={11} /> {getRank(level)}
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {xpRemaining > 0 ? `${xpRemaining} XP to Level ${level + 1}` : 'Maximum Level Achieved!'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 800, fontSize: '1.125rem' }}>
            <Zap size={18} fill="#f59e0b" />
            <span>{xp} XP</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Total Earned
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div
          style={{
            width: '100%',
            height: '10px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-primary), #a855f7, #ec4899)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 12px var(--color-primary-glow)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>Level {level} ({currentLevelBaseXp} XP)</span>
          <span>{progressPercent}% completed</span>
          <span>Level {level + 1} ({nextLevelXp} XP)</span>
        </div>
      </div>
    </div>
  );
}
