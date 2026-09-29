import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { timetableApi } from '../services/api';
import BlockEditor from '../components/timetable/BlockEditor';
import { CalendarDays, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

const PRESETS = [
  { title: 'Morning Deep Work', category: 'Coding', start_time: '09:00', end_time: '12:00', color: '#4F46E5' },
  { title: 'Lecture & Study', category: 'Study', start_time: '14:00', end_time: '16:00', color: '#F59E0B' },
  { title: 'Workout & Fitness', category: 'Health', start_time: '07:30', end_time: '08:30', color: '#10B981' },
  { title: 'Sprint Review & Sync', category: 'Work', start_time: '16:30', end_time: '17:30', color: '#EF4444' },
];

export default function CreateTimetablePage() {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSave = async (blockData) => {
    await timetableApi.create(blockData);
    setSuccessMsg('Timetable block created successfully!');
    setTimeout(() => {
      navigate('/timetable/view');
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Schedule Timetable Block
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Plan recurring daily and weekly time commitments for maximum adherence score
          </p>
        </div>

        <button onClick={() => navigate('/timetable/view')} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> View Schedule
        </button>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Presets */}
      <div>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Sparkles size={14} color="#f59e0b" /> Quick Template Presets
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedPreset(preset)}
              className="glass-card glass-card-hover"
              style={{
                padding: '0.75rem',
                textAlign: 'left',
                borderLeft: `4px solid ${preset.color}`,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                {preset.title}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                {preset.start_time} - {preset.end_time} • {preset.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Block Form */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <BlockEditor
          block={selectedPreset}
          onSave={handleSave}
          onCancel={() => navigate('/timetable/view')}
        />
      </div>
    </div>
  );
}
