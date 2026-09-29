import React, { useState, useEffect, useRef } from 'react';
import { pomodoroApi } from '../../services/api';
import { useGamification } from '../../context/GamificationContext';
import { Play, Pause, RotateCcw, Flame, CheckCircle, Clock } from 'lucide-react';

export default function PomodoroTimerWidget({ tasks = [], onSessionCompleted }) {
  const { handleReward, addToast } = useGamification();
  const [mode, setMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  const timerRef = useRef(null);

  const getDurationForMode = (m) => {
    switch (m) {
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
      default:
        return 25 * 60;
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getDurationForMode(newMode));
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            finishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const finishSession = async () => {
    const minutesLogged = Math.round(getDurationForMode(mode) / 60);

    if (mode === 'work') {
      try {
        const res = await pomodoroApi.logSession({
          duration_minutes: minutesLogged,
          task_id: selectedTaskId ? parseInt(selectedTaskId, 10) : null,
          started_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        });

        setCompletedSessionsCount((c) => c + 1);

        if (res.data?.gamification) {
          handleReward(res.data.gamification);
        } else {
          addToast({
            type: 'xp',
            title: 'Pomodoro Completed!',
            message: `Logged ${minutesLogged} minutes of deep focus.`,
          });
        }

        if (onSessionCompleted) onSessionCompleted();
      } catch (err) {
        console.error('Failed to log pomodoro:', err);
      }
    } else {
      addToast({
        type: 'info',
        title: 'Break Over!',
        message: 'Ready to dive back into deep focus?',
      });
    }

    // Reset to default
    setTimeLeft(getDurationForMode(mode));
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = getDurationForMode(mode);
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="glass-card pomodoro-card">
      {/* Mode Selectors */}
      <div className="pomodoro-modes">
        <button
          onClick={() => handleModeChange('work')}
          className="btn-sm"
          style={{
            borderRadius: 'var(--radius-full)',
            background: mode === 'work' ? 'var(--color-primary)' : 'transparent',
            color: mode === 'work' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 700,
          }}
        >
          25m Focus
        </button>
        <button
          onClick={() => handleModeChange('shortBreak')}
          className="btn-sm"
          style={{
            borderRadius: 'var(--radius-full)',
            background: mode === 'shortBreak' ? 'var(--color-success)' : 'transparent',
            color: mode === 'shortBreak' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 700,
          }}
        >
          5m Break
        </button>
        <button
          onClick={() => handleModeChange('longBreak')}
          className="btn-sm"
          style={{
            borderRadius: 'var(--radius-full)',
            background: mode === 'longBreak' ? 'var(--color-accent)' : 'transparent',
            color: mode === 'longBreak' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 700,
          }}
        >
          15m Break
        </button>
      </div>

      {/* Circular Timer Ring */}
      <div
        style={{
          position: 'relative',
          width: 'min(200px, 55vw)',
          height: 'min(200px, 55vw)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: `conic-gradient(var(--color-primary) ${progressPercent * 3.6}deg, var(--border-subtle) 0deg)`,
          marginBottom: '1.75rem',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            width: 'calc(100% - 24px)',
            height: 'calc(100% - 24px)',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{ fontSize: '2.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>
            {formattedTime}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {mode === 'work' ? 'Deep Work' : 'Rest Phase'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <button
          onClick={toggleTimer}
          className="btn btn-primary btn-lg"
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '0.875rem 2rem',
            boxShadow: '0 0 20px var(--color-primary-glow)',
          }}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="btn-ghost"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Task Linker */}
      <div style={{ width: '100%', maxWidth: '280px' }}>
        <select
          className="form-select"
          style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
        >
          <option value="">Link to Task (Optional)</option>
          {tasks
            .filter((t) => t.status !== 'completed' && t.status !== 'done')
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
