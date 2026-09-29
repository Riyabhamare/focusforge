import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { habitApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import { ArrowLeft, Flame, Sparkles } from 'lucide-react';

export default function AddHabitPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Health');
  const [frequency, setFrequency] = useState('daily');
  const [targetCount, setTargetCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addToast } = useGamification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Habit title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await habitApi.create({
        title,
        category,
        frequency,
        target_count: parseInt(targetCount, 10) || 1,
      });

      addToast({
        type: 'success',
        title: 'Habit Ritual Created!',
        message: `Added "${title}" to your daily crucible.`,
      });

      navigate('/habits');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Forge New Habit
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Build atomic daily or weekly habits to feed your streak multiplier
          </p>
        </div>

        <button onClick={() => navigate('/habits')} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Habit Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Read 20 pages of technical literature"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2col">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Health">Health</option>
                <option value="Coding">Coding</option>
                <option value="Study">Study</option>
                <option value="Productivity">Productivity</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Frequency</label>
              <select
                className="form-select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Completions (per period)</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="10"
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate('/habits')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating Habit...' : 'Forge Ritual (+25 XP)'} <Flame size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
