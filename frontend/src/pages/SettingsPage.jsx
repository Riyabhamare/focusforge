import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useGamification } from '../context/GamificationContext';
import { userApi } from '../services/api';
import { Settings, User, Bell, Moon, Sun, Shield, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useGamification();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'warrior');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [levelAlerts, setLevelAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.avatar) setAvatar(user.avatar);
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.updateSettings({ name, avatar });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your profile preferences have been updated.',
      });
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Settings & Preferences
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Personalize your character profile, notification alerts, and application theme
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.875rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <CheckCircle2 size={18} /> Settings successfully synchronized!
        </div>
      )}

      {/* Profile Details Form */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--color-primary)" /> Character Profile
        </h3>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address (Read Only)</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Character Class</label>
            <select
              className="form-select"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            >
              <option value="warrior">Iron Warrior (⚔️)</option>
              <option value="mage">Arcane Scholar (🔮)</option>
              <option value="rogue">Shadow Scout (🗡️)</option>
              <option value="paladin">Sun Crusader (🛡️)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem' }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Theme Preferences */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Visual Theme</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Current theme: <strong style={{ textTransform: 'capitalize' }}>{theme}</strong>
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="var(--color-primary)" /> Alert Notifications
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Auditory Chimes</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Play sound upon Pomodoro focus completion and XP gain</div>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Level-Up Celebration Modal</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Display celebratory fanfare popup when climbing to new rank</div>
          </div>
          <input
            type="checkbox"
            checked={levelAlerts}
            onChange={(e) => setLevelAlerts(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
