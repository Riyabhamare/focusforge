import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import PomodoroTimerWidget from '../components/pomodoro/PomodoroTimerWidget';
import { Plus, CheckCircle2, Clock, Sparkles, Filter } from 'lucide-react';

export default function TodayTasksPage() {
  const { handleReward } = useGamification();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'pending', 'completed'

  const fetchTodayTasks = async () => {
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await taskApi.getAll({ status: 'all' });
      if (res.data?.tasks) {
        // Today's tasks are either due today or pending
        const filtered = res.data.tasks.filter(
          (t) => t.due_date === todayStr || t.status === 'pending' || t.status === 'in_progress'
        );
        setTasks(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch today tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const handleComplete = async (taskId) => {
    try {
      const res = await taskApi.complete(taskId);
      if (res.data?.gamification) {
        handleReward(res.data.gamification);
      }
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
      );
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskApi.delete(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleCreateTask = async (taskData) => {
    const res = await taskApi.create(taskData);
    if (res.data?.task) {
      setTasks((prev) => [res.data.task, ...prev]);
    }
  };

  const visibleTasks = tasks.filter((t) => {
    if (filterMode === 'pending') return t.status !== 'completed' && t.status !== 'done';
    if (filterMode === 'completed') return t.status === 'completed' || t.status === 'done';
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === 'completed' || t.status === 'done').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', minWidth: 0 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Today's Combat Queue
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {completedCount} of {tasks.length} tasks vanquished (+10 XP per completion)
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Quick Add Task
        </button>
      </div>

      <div className="today-tasks-grid">
        {/* Main Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, width: '100%' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterMode('all')}
              className={`btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`btn-sm ${filterMode === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Pending ({tasks.length - completedCount})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`btn-sm ${filterMode === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading today's tasks...
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <CheckCircle2 size={44} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {filterMode === 'completed' ? 'No completed tasks yet today' : 'No pending tasks for today!'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Keep the forge blazing by scheduling tasks or running a focus sprint.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary">
                <Plus size={16} /> Forge a New Task
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', minWidth: 0 }}>
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Focus Chamber (Pomodoro) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Focus Chamber</h3>
          </div>
          <PomodoroTimerWidget
            tasks={tasks}
            onSessionCompleted={() => {
              fetchTodayTasks();
            }}
          />
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
      />
    </div>
  );
}
