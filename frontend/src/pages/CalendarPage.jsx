import React, { useState, useEffect } from 'react';
import { calendarApi } from '../services/api';
import Modal from '../components/common/Modal';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Tag } from 'lucide-react';

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'event',
  });

  const fetchMonth = async (y, m) => {
    setLoading(true);
    try {
      const res = await calendarApi.getMonthView(y, m);
      setMonthData(res.data);
    } catch (err) {
      console.error('Failed to load calendar month:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonth(year, month);
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;
    try {
      await calendarApi.createEvent(eventForm);
      setIsModalOpen(false);
      setEventForm({ title: '', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'event' });
      fetchMonth(year, month);
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Calendar grid calculations
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate();

  const daysMap = monthData?.days || {};

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Chronos Calendar Matrix
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Unified month view aggregating scheduled tasks, completed habits, and custom milestones
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
            <button onClick={handlePrevMonth} className="btn-ghost" style={{ padding: '0.35rem' }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', padding: '0 0.5rem', minWidth: '130px', textAlign: 'center' }}>
              {monthNames[month - 1]} {year}
            </span>
            <button onClick={handleNextMonth} className="btn-ghost" style={{ padding: '0.35rem' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      {/* 7-day Header */}
      <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', gap: '8px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
            <div key={idx} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-dim)', padding: '0.5rem 0' }}>
              {d}
            </div>
          ))}

          {/* Blank offset days */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`blank-${idx}`} style={{ minHeight: '100px', background: 'transparent' }} />
          ))}

          {/* Actual days in month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const paddedMonth = String(month).padStart(2, '0');
            const paddedDay = String(dayNum).padStart(2, '0');
            const dateKey = `${year}-${paddedMonth}-${paddedDay}`;
            const events = daysMap[dateKey] || [];
            const isToday =
              now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === dayNum;

            return (
              <div
                key={dateKey}
                onClick={() => events.length > 0 && setSelectedDayEvents({ date: dateKey, events })}
                style={{
                  minHeight: '110px',
                  background: isToday ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                  border: isToday ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: events.length > 0 ? 'pointer' : 'default',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: isToday ? 800 : 600,
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: isToday ? 'var(--color-primary)' : 'transparent',
                      color: isToday ? '#fff' : 'var(--text-main)',
                    }}
                  >
                    {dayNum}
                  </span>
                  {events.length > 0 && (
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                      {events.length}
                    </span>
                  )}
                </div>

                {/* Event Pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                  {events.slice(0, 3).map((item, eIdx) => {
                    const isTask = item.type === 'task';
                    const isHabit = item.type === 'habit';
                    return (
                      <div
                        key={eIdx}
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          padding: '2px 4px',
                          borderRadius: '3px',
                          background: isTask
                            ? 'rgba(99, 102, 241, 0.2)'
                            : isHabit
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                          color: isTask ? '#818cf8' : isHabit ? '#34d399' : '#fbbf24',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </div>
                    );
                  })}
                  {events.length > 3 && (
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-dim)' }}>
                      +{events.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Modal */}
      <Modal
        isOpen={!!selectedDayEvents}
        onClose={() => setSelectedDayEvents(null)}
        title={`Activities on ${selectedDayEvents?.date}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {selectedDayEvents?.events.map((e, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{e.title}</div>
                {e.time && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Clock size={12} /> {e.time}
                  </div>
                )}
              </div>
              <span className={`badge ${e.type === 'task' ? 'badge-primary' : e.type === 'habit' ? 'badge-success' : 'badge-warning'}`}>
                {e.type}
              </span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Create Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Calendar Event">
        <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sprint Demo or Project Exam"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row-2col">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Time (Optional)</label>
              <input
                type="time"
                className="form-input"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Schedule Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
