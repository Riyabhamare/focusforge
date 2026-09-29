import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { taskApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilter from '../components/tasks/TaskFilter';
import { Plus, ListTodo, Sparkles } from 'lucide-react';

export default function AllTasksPage() {
  const { handleReward } = useGamification();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    sortBy: 'due_date',
    sortOrder: 'ASC',
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskApi.getAll(filters);
      if (res.data?.tasks) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskApi.delete(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            All Quests & Tasks
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Filter, search, and manage your entire backlog
          </p>
        </div>

        <Link to="/tasks/new" className="btn btn-primary">
          <Plus size={18} /> New Task
        </Link>
      </div>

      {/* Task Filters */}
      <TaskFilter filters={filters} onChange={setFilters} />

      {/* Task Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <ListTodo size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No tasks match your filters
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Try adjusting your search criteria or create a new task.
          </p>
          <Link to="/tasks/new" className="btn btn-secondary">
            <Plus size={16} /> Create Task
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map((task) => (
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
  );
}
