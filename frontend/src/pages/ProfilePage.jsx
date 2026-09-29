import React, { useState, useEffect } from 'react';
import { userApi, badgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { User, Award, Zap, Flame, Clock, CheckCircle2, Shield, Sparkles, Edit3, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser, updateUser } = useAuth();
  const { xp, level, streak, addToast } = useGamification();
  const [xpHistory, setXpHistory] = useState([]);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || 'warrior');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user?.name) setEditName(user.name);
    if (user?.avatar) setEditAvatar(user.avatar);
  }, [user]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      if (refreshUser) {
        refreshUser();
      }
      try {
        const [xpRes, badgeRes, statsRes] = await Promise.allSettled([
          userApi.getXpHistory(),
          badgeApi.getAll(),
          userApi.getStats(),
        ]);

        if (xpRes.status === 'fulfilled' && xpRes.value.data?.history) {
          setXpHistory(xpRes.value.data.history);
        }
        if (badgeRes.status === 'fulfilled' && badgeRes.value.data?.badges) {
          setBadges(badgeRes.value.data.badges);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value.data?.stats) {
          setStats(statsRes.value.data.stats);
          if (statsRes.value.data.stats.user && updateUser) {
            updateUser(statsRes.value.data.stats.user);
          }
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setSavingProfile(true);
    try {
      const res = await userApi.updateSettings({ name: editName.trim(), avatar: editAvatar });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      setIsEditing(false);
      if (addToast) {
        addToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your character profile has been permanently updated in MySQL.',
        });
      }
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingProfile(false);
    }
  };

  const unlockedBadges = badges.filter((b) => b.unlocked);

  const getRank = (lvl) => {
    if (lvl >= 10) return 'Mythic Titan';
    if (lvl >= 7) return 'Master Artificer';
    if (lvl >= 5) return 'Iron Grandmaster';
    if (lvl >= 3) return 'Adept Forger';
    return 'Apprentice Forger';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Profile Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))',
        }}
      >
        {/* Avatar Badge */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '2.5rem',
            boxShadow: '0 0 30px var(--color-primary-glow)',
            flexShrink: 0,
          }}
        >
          {user?.name ? user.name[0].toUpperCase() : 'W'}
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          {isEditing ? (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '380px', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.95rem' }}
                />
                <select
                  className="form-select"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  style={{ width: '130px', padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
                >
                  <option value="warrior">Warrior (⚔️)</option>
                  <option value="mage">Scholar (🔮)</option>
                  <option value="rogue">Scout (🗡️)</option>
                  <option value="paladin">Crusader (🛡️)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
                >
                  <Save size={14} /> {savingProfile ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(user?.name || '');
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {user?.name || 'Warrior'}
              </h1>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                Level {level} {getRank(level)}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Edit Character Profile"
              >
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {user?.email} • Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2026'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: 700 }}>
              <Zap size={18} fill="#f59e0b" />
              <span>{xp} Total XP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700 }}>
              <Flame size={18} fill="#10b981" />
              <span>{streak.current_streak || 0} Day Streak</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8b5cf6', fontWeight: 700 }}>
              <Award size={18} />
              <span>{unlockedBadges.length} Badges Unlocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Trophy & Badge Showcase</h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {unlockedBadges.length} of {badges.length} Unlocked
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: badge.unlocked ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)',
                border: badge.unlocked ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
                opacity: badge.unlocked ? 1 : 0.5,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: badge.unlocked ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: badge.unlocked ? 'var(--color-primary)' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{badge.name}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological XP Audit Log */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem' }}>
          Chronological XP Activity Feed
        </h3>

        {xpHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
            No XP events recorded yet. Complete a task or habit to begin!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {xpHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    +{item.amount} XP
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {item.reason}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
