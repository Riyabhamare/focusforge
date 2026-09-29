import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Zap, Award, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useGamification();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'xp':
        return <Zap size={20} className="toast-icon text-amber" style={{ color: '#f59e0b' }} />;
      case 'badge':
        return <Award size={20} className="toast-icon text-purple" style={{ color: '#a855f7' }} />;
      case 'success':
        return <CheckCircle2 size={20} className="toast-icon text-green" style={{ color: '#10b981' }} />;
      case 'error':
        return <AlertCircle size={20} className="toast-icon text-red" style={{ color: '#ef4444' }} />;
      default:
        return <Info size={20} className="toast-icon text-blue" style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-pop-in"
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-surface)',
            border: toast.type === 'xp' ? '1px solid #f59e0b' : toast.type === 'badge' ? '1px solid #a855f7' : '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem 1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>
            {getIcon(toast.type)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {toast.title && (
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '2px' }}>
                {toast.title}
              </div>
            )}
            {toast.message && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              padding: '2px',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
