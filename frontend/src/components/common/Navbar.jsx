import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import {
  Menu,
  Sun,
  Moon,
  Flame,
  Zap,
  Bell,
  User,
  LogOut,
  Settings,
  Award,
  ChevronDown,
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, onOpenMobileDrawer }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { xp, level, streak } = useGamification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Next level calculation: Level(XP) = floor(1 + sqrt(XP / 250))
  // Level L begins at XP = 250 * (L - 1)^2
  // Next level L+1 starts at 250 * L^2
  const currentLevelBaseXp = 250 * Math.pow(level - 1, 2);
  const nextLevelXp = 250 * Math.pow(level, 2);
  const xpInCurrentLevel = Math.max(0, xp - currentLevelBaseXp);
  const xpNeededForNext = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  return (
    <header className="navbar-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Toggle sidebar button */}
        <button
          onClick={onToggleSidebar}
          className="btn-ghost"
          style={{ padding: '0.5rem', display: 'none' }}
          id="desktop-sidebar-toggle"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileDrawer}
          className="btn-ghost mobile-menu-btn"
          style={{ padding: '0.4rem' }}
          title="Open Menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/dashboard" className="navbar-brand-link">
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary), #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 0 15px var(--color-primary-glow)',
            flexShrink: 0,
          }}>
            ⚡
          </div>
          <span className="navbar-brand-text">
            Focus<span className="gradient-text">Forge</span>
          </span>
        </Link>
      </div>

      {/* Gamification Stats in Topbar */}
      <div className="navbar-actions">
        {/* Streak Flame */}
        <Link
          to="/streaks"
          className="navbar-streak-badge"
          title={`${streak.current_streak || 0} day active streak`}
        >
          <Flame size={15} fill="#f59e0b" />
          <span>{streak.current_streak || 0}d</span>
        </Link>

        {/* Level & XP Mini Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'var(--bg-surface)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}
          className="xp-topbar-widget"
        >
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            LVL {level}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '80px', gap: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              <span>{xp} XP</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn-ghost navbar-icon-btn"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#6366f1" />}
        </button>

        {/* Notifications */}
        <Link
          to="/achievements"
          className="btn-ghost navbar-icon-btn"
          title="Achievements & Notifications"
        >
          <Bell size={17} />
        </Link>

        {/* User Avatar Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="navbar-user-btn"
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8125rem',
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>

          {dropdownOpen && (
            <div
              className="glass-card animate-pop-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '115%',
                width: '210px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
              }}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.name || 'Warrior'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
              </div>
              <Link
                to="/profile"
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                onClick={() => setDropdownOpen(false)}
              >
                <User size={16} /> Profile & Badges
              </Link>
              <Link
                to="/settings"
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} /> Settings
              </Link>
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.25rem 0' }} />
              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', color: 'var(--color-danger)' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
