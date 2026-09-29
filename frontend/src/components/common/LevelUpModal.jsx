import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Sparkles, Trophy, ArrowRight, X } from 'lucide-react';

export default function LevelUpModal() {
  const { levelUpData, closeLevelUpModal } = useGamification();

  if (!levelUpData) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: 'var(--bg-overlay)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div
        className="animate-pop-in"
        style={{
          background: 'var(--bg-surface)',
          border: '2px solid #8b5cf6',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.4)',
          position: 'relative',
        }}
      >
        <button
          onClick={closeLevelUpModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
        }}>
          <Trophy size={42} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
        }}>
          <Sparkles size={14} /> LEVEL UP CELEBRATION!
        </div>

        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          You Reached Level {levelUpData.newLevel}!
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.75rem' }}>
          Your focus and dedication are paying off. You've earned higher prestige and forged greater discipline!
        </p>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid var(--border-card)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total XP</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {levelUpData.totalXp} XP
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Rank Title</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
              {levelUpData.newLevel >= 5 ? 'Iron Grandmaster' : levelUpData.newLevel >= 3 ? 'Adept Forger' : 'Apprentice'}
            </div>
          </div>
        </div>

        <button
          onClick={closeLevelUpModal}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.875rem' }}
        >
          Continue Conquering <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
