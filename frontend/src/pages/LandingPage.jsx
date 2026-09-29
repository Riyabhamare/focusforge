import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Flame,
  Award,
  Calendar,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-primary), #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.2rem',
              boxShadow: '0 0 15px var(--color-primary-glow)',
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
            Focus<span className="gradient-text">Forge</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/about" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Methodology
          </Link>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Launch Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <button onClick={handleDemo} className="btn btn-primary btn-sm">
                Try Demo <Sparkles size={14} />
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '6rem 2rem 4rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            background: 'var(--color-primary-light)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-full)',
            color: '#818cf8',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}
        >
          <Sparkles size={14} /> LEVEL UP YOUR REAL-LIFE PRODUCTIVITY
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            maxWidth: '900px',
          }}
        >
          Transform Your Work Into A <span className="gradient-text">Gamified Quest</span>
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}
        >
          FocusForge binds task management, habit streaks, weekly timetable scheduling, and Pomodoro focus into an RPG progression system with real XP, level milestones, and achievements.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleDemo} className="btn btn-primary btn-lg" style={{ padding: '0.9rem 2.2rem' }}>
            Try Live Demo (Instant) <Sparkles size={18} />
          </button>
          <Link to="/register" className="btn btn-secondary btn-lg" style={{ padding: '0.9rem 2.2rem' }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            marginTop: '5rem',
            textAlign: 'left',
          }}
        >
          <div className="glass-card glass-card-hover" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              RPG Experience & Levels
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Earn +10 XP for tasks, +25 XP for habits, and +50 XP for milestones. Level formula scales exponentially to challenge you every day.
            </p>
          </div>

          <div className="glass-card glass-card-hover" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Flame size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              365-Day Activity Heatmap
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Visualize your consistency with our GitHub-style activity matrix. Build indestructible streaks that keep you accountable all year.
            </p>
          </div>

          <div className="glass-card glass-card-hover" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Weekly Timetable Blocks
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Schedule recurring deep work, classes, and exercise blocks. The algorithm scores your daily adherence automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          padding: '2.5rem 2rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.875rem',
        }}
      >
        <p>© 2026 FocusForge. Built for peak discipline & productivity mastery.</p>
      </footer>
    </div>
  );
}
