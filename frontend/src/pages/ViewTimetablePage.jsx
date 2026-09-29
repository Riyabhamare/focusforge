import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { timetableApi } from '../services/api';
import WeeklyGrid from '../components/timetable/WeeklyGrid';
import Modal from '../components/common/Modal';
import BlockEditor from '../components/timetable/BlockEditor';
import { Plus, Calendar, Clock, Sparkles } from 'lucide-react';

export default function ViewTimetablePage() {
  const [blocksByDay, setBlocksByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [error, setError] = useState('');

  const fetchTimetable = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await timetableApi.getWeek();
      if (res.data?.week) {
        setBlocksByDay(res.data.week);
      }
    } catch (err) {
      setError('Failed to fetch timetable schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleDelete = async (blockId) => {
    if (!window.confirm('Are you sure you want to delete this timetable block?')) return;
    try {
      await timetableApi.delete(blockId);
      await fetchTimetable();
    } catch (err) {
      alert('Failed to delete block');
    }
  };

  const handleUpdate = async (blockData) => {
    if (!editingBlock) return;
    await timetableApi.update(editingBlock.id, blockData);
    setEditingBlock(null);
    await fetchTimetable();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Weekly Timetable Schedule
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Structured time blocks for daily adherence & focus mastery
          </p>
        </div>

        <Link to="/timetable/create" className="btn btn-primary">
          <Plus size={18} /> Add Time Block
        </Link>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading timetable...
        </div>
      ) : (
        <WeeklyGrid
          blocksByDay={blocksByDay}
          onEditBlock={(block) => setEditingBlock(block)}
          onDeleteBlock={handleDelete}
        />
      )}

      {/* Edit Block Modal */}
      <Modal
        isOpen={!!editingBlock}
        onClose={() => setEditingBlock(null)}
        title="Edit Timetable Block"
      >
        {editingBlock && (
          <BlockEditor
            block={editingBlock}
            onSave={handleUpdate}
            onCancel={() => setEditingBlock(null)}
          />
        )}
      </Modal>
    </div>
  );
}
