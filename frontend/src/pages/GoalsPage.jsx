import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { goalApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import Modal from '../components/common/Modal';
import { Target, Plus, CheckCircle2, Circle, Calendar, Trash2, Activity, Sparkles } from 'lucide-react';

export default function GoalsPage() {
  const { handleReward, addToast } = useGamification();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    progress_percent: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchGoals = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await goalApi.getAll();
      if (res.data?.goals) {
        setGoals(res.data.goals);
      }
    } catch (err) {
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setSaving(true);
    try {
      const res = await goalApi.create(formData);
      if (res.data?.goal) {
        setGoals((prev) => [res.data.goal, ...prev]);
      }
      setIsModalOpen(false);
      setFormData({ title: '', description: '', target_date: '', progress_percent: 0 });
      addToast({
        type: 'success',
        title: 'New Milestone Set!',
        message: `Milestone "${formData.title}" is now active.`,
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create goal');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (goalId) => {
    try {
      const res = await goalApi.complete(goalId);
      if (res.data?.gamification) {
        handleReward(res.data.gamification);
      }
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, status: 'completed', progress_percent: 100 } : g))
      );
    } catch (err) {
      console.error('Failed to complete goal:', err);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm('Delete this milestone?')) return;
    try {
      await goalApi.delete(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (err) {
      alert('Failed to delete goal');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Epic Goals & Milestones
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Large achievements rewarded with +50 XP and trophy badges
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/goals/progress" className="btn btn-secondary">
            <Activity size={16} /> Update Progress Bars
          </Link>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Set Milestone
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading milestones...
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Target size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Long-Term Milestones Set
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Set a grand vision to unlock high-tier trophies and maximum XP rewards.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Forge First Milestone
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', width: '100%' }}>
          {goals.map((goal) => {
            const isCompleted = goal.status === 'completed';
            return (
              <div
                key={goal.id}
                className="glass-card glass-card-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  opacity: isCompleted ? 0.8 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <button
                      onClick={() => !isCompleted && handleComplete(goal.id)}
                      disabled={isCompleted}
                      className="btn-ghost"
                      style={{ padding: '2px', color: isCompleted ? 'var(--color-success)' : 'var(--text-dim)', marginTop: '2px' }}
                      title={isCompleted ? 'Goal completed' : 'Mark Completed (+50 XP)'}
                    >
                      {isCompleted ? <CheckCircle2 size={24} color="var(--color-success)" /> : <Circle size={24} />}
                    </button>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="btn-ghost"
                    style={{ padding: '0.25rem', color: 'var(--color-danger)' }}
                    title="Delete Goal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Progress bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Progress</span>
                    <span style={{ fontWeight: 700, color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)' }}>
                      {goal.progress_percent || 0}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${goal.progress_percent || 0}%`,
                        height: '100%',
                        background: isCompleted ? 'var(--color-success)' : 'linear-gradient(90deg, #6366f1, #ec4899)',
                        borderRadius: '4px',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>

                {/* Footer with target date */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} />
                    <span>Target: {goal.target_date || 'Ongoing'}</span>
                  </div>
                  <span className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'}`}>
                    {goal.status || 'in_progress'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Goal Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Forge New Milestone">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Goal Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Master Dual Database Architecture"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Detailed Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="What defines completion of this epic milestone?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Completion Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Creating...' : 'Forge Milestone (+50 XP on completion)'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
