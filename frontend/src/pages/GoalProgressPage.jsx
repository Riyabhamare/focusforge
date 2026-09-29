import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { goalApi, taskApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import { Target, ArrowLeft, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

export default function GoalProgressPage() {
  const { handleReward, addToast } = useGamification();
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [goalRes, taskRes] = await Promise.allSettled([
        goalApi.getAll(),
        taskApi.getAll({ status: 'all' }),
      ]);

      if (goalRes.status === 'fulfilled' && goalRes.value.data?.goals) {
        setGoals(goalRes.value.data.goals);
      }
      if (taskRes.status === 'fulfilled' && taskRes.value.data?.tasks) {
        setTasks(taskRes.value.data.tasks);
      }
    } catch (err) {
      console.error('Failed to load goal progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSliderChange = async (goalId, newPercent) => {
    // Update locally immediately for responsiveness
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progress_percent: newPercent } : g))
    );

    try {
      const res = await goalApi.updateProgress(goalId, newPercent);
      if (res.data?.gamification) {
        handleReward(res.data.gamification);
      }
      if (newPercent === 100) {
        addToast({
          type: 'success',
          title: 'Goal Completed!',
          message: '100% Milestone completion reached!',
        });
      }
    } catch (err) {
      console.error('Failed to update goal progress:', err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Goal Progress & Milestone Tuning
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Adjust completion percentages and view associated combat tasks
          </p>
        </div>

        <Link to="/goals" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Milestones
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading progress bars...
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Target size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Milestones</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Create a goal first before adjusting its progress percentage.
          </p>
          <Link to="/goals" className="btn btn-primary">
            Create Milestone
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {goals.map((goal) => {
            const isCompleted = goal.progress_percent === 100 || goal.status === 'completed';

            return (
              <div
                key={goal.id}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {goal.title}
                      </h3>
                      {isCompleted && (
                        <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                          <CheckCircle2 size={12} /> Mastered
                        </span>
                      )}
                    </div>
                    {goal.description && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {goal.description}
                      </p>
                    )}
                  </div>

                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)' }}>
                    {goal.progress_percent || 0}%
                  </div>
                </div>

                {/* Progress bar and slider control */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ width: '100%', height: '10px', background: 'var(--border-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${goal.progress_percent || 0}%`,
                        height: '100%',
                        background: isCompleted ? 'var(--color-success)' : 'linear-gradient(90deg, #6366f1, #ec4899)',
                        borderRadius: '5px',
                        transition: 'width 200ms ease',
                      }}
                    />
                  </div>

                  {/* Interactive Slider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <Sliders size={16} color="var(--text-dim)" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={goal.progress_percent || 0}
                      onChange={(e) => handleSliderChange(goal.id, parseInt(e.target.value, 10))}
                      style={{ flex: 1, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '45px', textAlign: 'right' }}>
                      {goal.progress_percent || 0}%
                    </span>
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
