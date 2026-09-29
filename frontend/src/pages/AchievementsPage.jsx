import React, { useState, useEffect } from 'react';
import { badgeApi } from '../services/api';
import { Award, Lock, CheckCircle2, Shield, Sparkles, Flame, Clock, Calendar, Trophy, Sunrise } from 'lucide-react';

export default function AchievementsPage() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBadges = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await badgeApi.getAll();
      if (res.data?.badges) {
        setBadges(res.data.badges);
      }
    } catch (err) {
      setError('Failed to fetch achievement badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const getBadgeIcon = (key) => {
    switch (key) {
      case 'early_bird':
        return <Sunrise size={28} />;
      case 'consistent':
        return <Flame size={28} />;
      case 'focus_master':
        return <Clock size={28} />;
      case 'century_club':
        return <Trophy size={28} />;
      case 'first_week':
        return <Calendar size={28} />;
      default:
        return <Award size={28} />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Achievements & Badges
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Permanent proof of discipline, consistency, and focus mastery ({unlockedCount} of {badges.length} Unlocked)
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-card)',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: '#f59e0b',
          }}
        >
          <Sparkles size={16} />
          <span>{Math.round((unlockedCount / Math.max(1, badges.length)) * 100)}% Gallery Complete</span>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Evaluating badge criteria...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', width: '100%' }}>
          {badges.map((badge) => {
            const current = badge.progress?.current ?? 0;
            const target = badge.progress?.target ?? 100;
            const progressPercent = Math.min(100, Math.round((current / target) * 100));

            return (
              <div
                key={badge.id}
                className="glass-card glass-card-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  border: badge.unlocked ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
                  background: badge.unlocked ? 'var(--bg-card)' : 'var(--bg-surface)',
                  boxShadow: badge.unlocked ? '0 0 20px rgba(99, 102, 241, 0.15)' : 'none',
                  opacity: badge.unlocked ? 1 : 0.75,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-lg)',
                      background: badge.unlocked
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))'
                        : 'var(--border-subtle)',
                      color: badge.unlocked ? 'var(--color-primary)' : 'var(--text-dim)',
                      border: badge.unlocked ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: badge.unlocked ? '0 0 15px var(--color-primary-glow)' : 'none',
                      flexShrink: 0,
                    }}
                  >
                    {getBadgeIcon(badge.key)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {badge.name}
                      </h3>
                      {badge.unlocked ? (
                        <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                          <CheckCircle2 size={11} /> Unlocked
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.6875rem' }}>
                          <Lock size={11} /> Locked
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar to unlock */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span>Requirement Progress</span>
                    <span style={{ fontWeight: 700, color: badge.unlocked ? 'var(--color-success)' : 'var(--text-main)' }}>
                      {current} / {target} ({progressPercent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: badge.unlocked ? 'var(--color-success)' : 'linear-gradient(90deg, #6366f1, #a855f7)',
                        borderRadius: '3px',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
