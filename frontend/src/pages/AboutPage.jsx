import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Flame, Clock, Award, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the RPG Level and XP calculation work?',
    a: 'Every completed task awards +10 XP, habits grant +25 XP, and milestone goals grant +50 XP. Your Level is governed by the mathematical formula: Level(XP) = floor(1 + sqrt(XP / 250)). As you progress to higher ranks (Apprentice → Adept → Grandmaster → Master Artificer → Mythic Titan), leveling requires exponentially more mastery.',
  },
  {
    q: 'How is the Daily Productivity Score computed?',
    a: 'Your daily score is a weighted composite: Score = min(100, 0.40 * S_tasks + 0.30 * S_habits + 0.15 * S_timetable + 0.15 * S_pomodoro). S_tasks measures tasks done vs planned, S_habits measures daily rituals completed, S_timetable verifies activity during scheduled blocks, and S_pomodoro tracks progress toward 120 minutes of deep focus.',
  },
  {
    q: 'What is the 365-Day Heatmap and Intensity Buckets?',
    a: 'Similar to developer contribution matrixes, each day calculates activity points: (completed_tasks * 10) + (completed_habits * 15) + (focus_minutes * 1). Bucket 0 = 0 pts, Bucket 1 = 1-25 pts, Bucket 2 = 26-50 pts, Bucket 3 = 51-75 pts, and Bucket 4 = 76+ pts.',
  },
  {
    q: 'Can FocusForge run offline or with different databases?',
    a: 'Yes! The FocusForge backend implements a dual-mode database engine. It attempts to connect to MySQL on startup; if unreachable or timed out, it seamlessly falls back to a high-speed local SQLite database with zero downtime.',
  },
  {
    q: 'How do streak multipliers stay active?',
    a: 'Streaks increment when you log at least one completed task, habit, or Pomodoro session on consecutive calendar days. If more than 24-48 hours lapse without active logs, the streak resets to 1.',
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.875rem',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={14} /> FORGER’S CODEX & ARCHITECTURE
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
          About FocusForge
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0', lineHeight: 1.6 }}>
          The science of gamification fused with actionable behavioral psychology and state-of-the-art web architecture.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
            <Zap size={28} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Instant Feedback Loops
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Dopamine rewards are delivered in real time upon action completion, transforming tedious chores into rewarding milestone quests.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#10b981', marginBottom: '0.75rem' }}>
            <Flame size={28} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Unbroken Momentum
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            The 365-day heatmap and streak counters leverage loss aversion to maintain habit adherence across weeks and months.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#6366f1', marginBottom: '0.75rem' }}>
            <Clock size={28} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Time Blocking Discipline
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Aligning tasks into structured weekly timetable blocks protects deep work focus and prevents decision fatigue.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Frequently Asked Questions & Formulas
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.25rem 1.25rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Ready to Forge Your Masterpiece?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Step into the arena and turn routine tasks into extraordinary discipline.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Launch Dashboard Now
        </Link>
      </div>
    </div>
  );
}
