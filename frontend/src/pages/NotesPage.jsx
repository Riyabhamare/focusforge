import React, { useState, useEffect } from 'react';
import { noteApi, taskApi, goalApi } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import { FileText, Plus, Trash2, Edit3, Tag, Search, CheckSquare, Target, Eye, Code } from 'lucide-react';

// Helper for inline markdown: bold, inline code
function renderInlineMarkdown(str) {
  if (!str) return '';
  const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            padding: '2px 6px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            color: '#f59e0b',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85em',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--text-main)', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Helper to format and render markdown cleanly
function renderMarkdown(text) {
  if (!text) return null;
  // Normalize literal \n, \r\n, and real newlines
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n');
  const rawLines = cleanText.split('\n');

  const elements = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeBlockLang = '';

  for (let idx = 0; idx < rawLines.length; idx++) {
    const line = rawLines[idx];
    const trimmed = line.trim();

    // Check for fenced code block toggle (e.g. ```js or ```)
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // Closing code block
        elements.push(
          <pre
            key={`code-${idx}`}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#38bdf8',
              overflowX: 'auto',
              lineHeight: 1.5,
              margin: '0.35rem 0',
            }}
          >
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
        codeBlockLang = '';
      } else {
        // Opening code block
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={idx} style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.75rem' }}>
          {renderInlineMarkdown(line.replace('### ', ''))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={idx} style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '1rem' }}>
          {renderInlineMarkdown(line.replace('## ', ''))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={idx} style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '1.25rem' }}>
          {renderInlineMarkdown(line.replace('# ', ''))}
        </h2>
      );
      continue;
    }

    // Bullet list items (support nested indentation)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const indentMatch = line.match(/^([ \t]*)/);
      const spaces = indentMatch ? indentMatch[1].replace(/\t/g, '  ').length : 0;
      const depth = Math.floor(spaces / 2);
      const marginLeft = `${0.5 + depth * 1.25}rem`;
      const content = trimmed.substring(2);

      elements.push(
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginLeft }}>
          <span style={{ color: depth > 0 ? 'var(--text-muted)' : 'var(--color-primary)', fontWeight: 800 }}>
            {depth > 0 ? '◦' : '•'}
          </span>
          <span style={{ flex: 1 }}>{renderInlineMarkdown(content)}</span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={idx} style={{ height: '0.5rem' }} />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={idx} style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  // Handle unclosed code block at EOF gracefully
  if (inCodeBlock && codeBlockLines.length > 0) {
    elements.push(
      <pre
        key="code-eof"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: '#38bdf8',
          overflowX: 'auto',
          lineHeight: 1.5,
          margin: '0.35rem 0',
        }}
      >
        <code>{codeBlockLines.join('\n')}</code>
      </pre>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {elements}
    </div>
  );
}

export default function NotesPage() {
  const { addToast } = useGamification();
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content_markdown: '',
    tags: '',
    linked_task_id: '',
    linked_goal_id: '',
  });

  const fetchNotesAndLinks = async () => {
    setLoading(true);
    try {
      const [noteRes, taskRes, goalRes] = await Promise.allSettled([
        noteApi.getAll({ search: searchQuery, tag: selectedTag }),
        taskApi.getAll({ status: 'all' }),
        goalApi.getAll(),
      ]);

      if (noteRes.status === 'fulfilled' && noteRes.value.data?.notes) {
        setNotes(noteRes.value.data.notes);
        if (!selectedNote && noteRes.value.data.notes.length > 0) {
          setSelectedNote(noteRes.value.data.notes[0]);
        }
      }
      if (taskRes.status === 'fulfilled' && taskRes.value.data?.tasks) {
        setTasks(taskRes.value.data.tasks);
      }
      if (goalRes.status === 'fulfilled' && goalRes.value.data?.goals) {
        setGoals(goalRes.value.data.goals);
      }
    } catch (err) {
      console.error('Failed to load notes data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesAndLinks();
  }, [searchQuery, selectedTag]);

  const handleStartNew = () => {
    setSelectedNote(null);
    setFormData({
      title: '',
      content_markdown: '# New Note\n\nWrite your thoughts, research, or study guide here.\n\n- Key objective 1\n- Key objective 2',
      tags: 'focus,productivity',
      linked_task_id: '',
      linked_goal_id: '',
    });
    setIsEditing(true);
    setIsPreview(false);
  };

  const handleStartEdit = (note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title || '',
      content_markdown: note.content_markdown ? note.content_markdown.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n') : '',
      tags: note.tags || '',
      linked_task_id: note.linked_task_id || '',
      linked_goal_id: note.linked_goal_id || '',
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (selectedNote?.id) {
        const res = await noteApi.update(selectedNote.id, formData);
        if (res.data?.note) {
          setNotes((prev) => prev.map((n) => (n.id === selectedNote.id ? res.data.note : n)));
          setSelectedNote(res.data.note);
        }
      } else {
        const res = await noteApi.create(formData);
        if (res.data?.note) {
          setNotes((prev) => [res.data.note, ...prev]);
          setSelectedNote(res.data.note);
        }
      }
      setIsEditing(false);
      addToast({
        type: 'success',
        title: 'Note Saved',
        message: `"${formData.title}" was saved successfully.`,
      });
    } catch (err) {
      alert('Failed to save note');
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await noteApi.delete(noteId);
      const remaining = notes.filter((n) => n.id !== noteId);
      setNotes(remaining);
      setSelectedNote(remaining.length > 0 ? remaining[0] : null);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  // Extract unique tags
  const allTags = Array.from(
    new Set(
      notes
        .flatMap((n) => (n.tags ? n.tags.split(',') : []))
        .map((t) => t.trim())
        .filter(Boolean)
    )
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Grimoire & Markdown Notes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Document your research, link notes to quests and goals, and search tags
          </p>
        </div>

        <button onClick={handleStartNew} className="btn btn-primary">
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Main Layout: Notes list on left, Editor/Viewer on right */}
      <div className="notes-layout-grid">
        {/* Left: Notes List & Tag Filters */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tag Filter Pills */}
            {allTags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                <button
                  onClick={() => setSelectedTag('')}
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: selectedTag === '' ? 'var(--color-primary)' : 'var(--bg-surface)',
                    color: selectedTag === '' ? '#fff' : 'var(--text-dim)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                    style={{
                      fontSize: '0.6875rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: selectedTag === tag ? 'var(--color-primary)' : 'var(--bg-surface)',
                      color: selectedTag === tag ? '#fff' : 'var(--text-dim)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
                No notes found. Create your first note.
              </div>
            ) : (
              notes.map((note) => {
                const isSelected = selectedNote?.id === note.id;
                const cleanSnippet = note.content_markdown
                  ? note.content_markdown.replace(/\\r\\n|\\n/g, ' ').replace(/[#*`]/g, '').slice(0, 55)
                  : '';

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsEditing(false);
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                      border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? 'var(--color-primary)' : 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {note.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cleanSnippet}...
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Note Detail / Editor */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', overflowY: 'auto' }}>
          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '1.25rem', fontWeight: 800, padding: '0.5rem 0.75rem' }}
                  placeholder="Note Title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="btn btn-secondary btn-sm"
                  >
                    {isPreview ? <Code size={16} /> : <Eye size={16} />}
                    <span>{isPreview ? 'Source' : 'Preview'}</span>
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Note
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">
                    Cancel
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.6875rem' }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '0.8125rem', padding: '0.4rem 0.6rem' }}
                    placeholder="react, algorithm, database"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.6875rem' }}>Link to Task</label>
                  <select
                    className="form-select"
                    style={{ fontSize: '0.8125rem', padding: '0.4rem 0.6rem' }}
                    value={formData.linked_task_id}
                    onChange={(e) => setFormData({ ...formData, linked_task_id: e.target.value })}
                  >
                    <option value="">None</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.6875rem' }}>Link to Goal</label>
                  <select
                    className="form-select"
                    style={{ fontSize: '0.8125rem', padding: '0.4rem 0.6rem' }}
                    value={formData.linked_goal_id}
                    onChange={(e) => setFormData({ ...formData, linked_goal_id: e.target.value })}
                  >
                    <option value="">None</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isPreview ? (
                <div
                  style={{
                    flex: 1,
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    overflowY: 'auto',
                    minHeight: '300px',
                  }}
                >
                  {renderMarkdown(formData.content_markdown)}
                </div>
              ) : (
                <textarea
                  className="form-textarea"
                  style={{
                    flex: 1,
                    minHeight: '300px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                  }}
                  value={formData.content_markdown}
                  onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
                  placeholder="Type your markdown content here..."
                />
              )}
            </form>
          ) : selectedNote ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {selectedNote.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    {selectedNote.tags?.split(',').map((tag, idx) => (
                      <span key={idx} className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
                        #{tag.trim()}
                      </span>
                    ))}
                    {selectedNote.task_title && (
                      <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                        Task: {selectedNote.task_title}
                      </span>
                    )}
                    {selectedNote.goal_title && (
                      <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>
                        Goal: {selectedNote.goal_title}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleStartEdit(selectedNote)} className="btn btn-secondary btn-sm">
                    <Edit3 size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(selectedNote.id)} className="btn btn-danger btn-sm">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  fontSize: '0.9375rem',
                  padding: '0.5rem 0',
                }}
              >
                {renderMarkdown(selectedNote.content_markdown)}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', gap: '1rem' }}>
              <FileText size={48} opacity={0.5} />
              <p>Select a note from the left or create a new one.</p>
              <button onClick={handleStartNew} className="btn btn-primary btn-sm">
                <Plus size={16} /> Create Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
