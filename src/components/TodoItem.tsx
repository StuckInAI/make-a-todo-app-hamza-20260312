'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function TodoItem({ todo, onUpdated, onDeleted }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editError, setEditError] = useState('');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const handleToggle = async () => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (res.ok) onUpdated();
    } catch {
      console.error('Failed to toggle todo');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this todo?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
      if (res.ok) onDeleted();
    } catch {
      console.error('Failed to delete todo');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSave = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditError('Title cannot be empty.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
          description: editDescription.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || 'Failed to update.');
        return;
      }
      setEditing(false);
      onUpdated();
    } catch {
      setEditError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditError('');
  };

  return (
    <div className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <div className="todo-item-main">
        <button
          className="todo-checkbox"
          onClick={handleToggle}
          title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed && <span className="todo-checkbox-icon">✓</span>}
        </button>
        <div className="todo-content">
          <div className="todo-title">{todo.title}</div>
          {todo.description && (
            <div className="todo-description">{todo.description}</div>
          )}
          <div className="todo-meta">Created {formatDate(todo.createdAt)}</div>
        </div>
        <div className="todo-actions">
          <button
            className="btn-icon edit"
            onClick={() => setEditing(!editing)}
            title="Edit"
            aria-label="Edit todo"
          >
            ✏️
          </button>
          <button
            className="btn-icon danger"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
            aria-label="Delete todo"
          >
            {deleting ? '…' : '🗑️'}
          </button>
        </div>
      </div>

      {editing && (
        <div className="todo-edit-form">
          {editError && <div className="error-msg">{editError}</div>}
          <input
            type="text"
            className="edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title *"
            disabled={saving}
            maxLength={255}
          />
          <textarea
            className="edit-textarea"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)…"
            disabled={saving}
            maxLength={1000}
          />
          <div className="edit-actions">
            <button className="btn-cancel" onClick={handleEditCancel} disabled={saving}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleEditSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
