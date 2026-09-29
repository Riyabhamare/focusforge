import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export default function TaskCard({ task, onComplete, onDelete }) {
  const isDone = task.status === 'completed' || task.status === 'done';

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="badge badge-danger">High Priority</span>;
      case 'medium':
        return <span className="badge badge-warning">Medium</span>;
      default:
        return <span className="badge badge-primary">Low</span>;
    }
  };

  return (
    <div
      className="glass-card glass-card-hover task-card"
      style={{
        opacity: isDone ? 0.75 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => !isDone && onComplete && onComplete(task.id)}
        disabled={isDone}
        className="btn-ghost task-checkbox"
        style={{
          padding: '4px',
          color: isDone ? 'var(--color-success)' : 'var(--text-dim)',
          cursor: isDone ? 'default' : 'pointer',
          marginTop: '2px',
          flexShrink: 0,
        }}
        title={isDone ? 'Completed' : 'Click to complete (+10 XP)'}
      >
        {isDone ? <CheckCircle2 size={22} color="var(--color-success)" /> : <Circle size={22} />}
      </button>

      {/* Task Content */}
      <div className="task-card-content">
        <div className="task-card-header">
          <h4
            className="task-card-title"
            style={{
              textDecoration: isDone ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </h4>
          <div className="task-card-badges">
            {getPriorityBadge(task.priority)}
            {task.category && (
              <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                {task.category}
              </span>
            )}
          </div>
        </div>

        {task.description && (
          <p className="task-card-description">
            {task.description}
          </p>
        )}

        {/* Metadata Footer */}
        <div className="task-card-footer">
          {task.due_date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={13} />
              <span>Due {task.due_date}</span>
            </div>
          )}
          {task.estimated_minutes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} />
              <span>{task.estimated_minutes} mins</span>
            </div>
          )}
          {isDone && task.completed_at && (
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="task-card-actions">
        <Link
          to={`/tasks/${task.id}/edit`}
          className="btn-ghost"
          style={{ padding: '0.45rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          title="Edit Task"
        >
          <Edit2 size={16} />
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="btn-ghost"
            style={{ padding: '0.45rem', color: 'var(--color-danger)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
