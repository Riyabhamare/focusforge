import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function TaskFilter({ filters, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}
    >
      {/* Search Bar */}
      <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dim)',
          }}
        />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => handleInputChange('search', e.target.value)}
        />
      </div>

      {/* Select Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Status */}
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.625rem 0.875rem' }}
          value={filters.status || ''}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority */}
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.625rem 0.875rem' }}
          value={filters.priority || ''}
          onChange={(e) => handleInputChange('priority', e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category */}
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.625rem 0.875rem' }}
          value={filters.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Coding">Coding</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
          <option value="Work">Work</option>
          <option value="General">General</option>
        </select>

        {/* Sort */}
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.625rem 0.875rem' }}
          value={filters.sortBy || 'due_date'}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="created_at">Created Date</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  );
}
