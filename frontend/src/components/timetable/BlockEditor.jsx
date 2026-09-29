import React, { useState, useEffect } from 'react';

const CATEGORY_COLORS = {
  Coding: '#4F46E5',
  Study: '#F59E0B',
  Health: '#10B981',
  Work: '#EF4444',
  General: '#8B5CF6',
};

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function BlockEditor({ block = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    day_of_week: 1,
    start_time: '09:00',
    end_time: '11:00',
    category: 'Coding',
    color: '#4F46E5',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (block) {
      setFormData({
        title: block.title || '',
        day_of_week: block.day_of_week ?? 1,
        start_time: block.start_time ? block.start_time.slice(0, 5) : '09:00',
        end_time: block.end_time ? block.end_time.slice(0, 5) : '11:00',
        category: block.category || 'Coding',
        color: block.color || CATEGORY_COLORS[block.category] || '#4F46E5',
      });
    }
  }, [block]);

  const handleCategoryChange = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      color: CATEGORY_COLORS[cat] || prev.color,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Block title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save block');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && (
        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Block Title *</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Deep Work: Algorithm Analysis"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Day of Week</label>
        <select
          className="form-select"
          value={formData.day_of_week}
          onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value, 10) })}
        >
          {DAYS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-input"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-input"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {Object.keys(CATEGORY_COLORS).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Color Accent</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              style={{
                width: '42px',
                height: '42px',
                padding: '2px',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: 'transparent',
              }}
            />
            <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {formData.color}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Saving...' : block ? 'Update Block' : 'Create Block'}
        </button>
      </div>
    </form>
  );
}
