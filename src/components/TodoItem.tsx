'use client';

import { useState } from 'react';

export interface TodoData {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty');
      return;
    }
    setEditError('');
    setLoading(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim());
      setEditing(false);
    } catch {
      setEditError('Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : 'pending'}`}>
      <div className="todo-item-content">
        <button
          className={`todo-checkbox-btn ${todo.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          disabled={loading}
          title={todo.completed ? 'Mark as pending' : 'Mark as completed'}
          aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {todo.completed ? '✓' : ''}
        </button>

        <div className="todo-body">
          <div className={`todo-title ${todo.completed ? 'completed-text' : ''}`}>
            {todo.title}
          </div>
          {todo.description && (
            <div className={`todo-description ${todo.completed ? 'completed-text' : ''}`}>
              {todo.description}
            </div>
          )}
          <div className="todo-meta">
            <span className={`badge ${todo.completed ? 'badge-completed' : 'badge-pending'}`}>
              {todo.completed ? '✓ Completed' : '◷ Pending'}
            </span>
            {' · '}
            {formatDate(todo.createdAt)}
          </div>
        </div>

        <div className="todo-actions">
          {!editing && (
            <button
              className="action-btn edit-btn"
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              ✏️ Edit
            </button>
          )}
          <button
            className="action-btn delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {editing && (
        <div className="todo-edit-form">
          {editError && <div className="error-message">{editError}</div>}
          <div className="form-group">
            <input
              type="text"
              className="edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Todo title"
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="form-group">
            <textarea
              className="edit-textarea"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)"
              disabled={loading}
              rows={2}
            />
          </div>
          <div className="edit-form-actions">
            <button
              className="action-btn save-btn"
              onClick={handleSaveEdit}
              disabled={loading || !editTitle.trim()}
            >
              {loading ? 'Saving...' : '✓ Save'}
            </button>
            <button
              className="action-btn cancel-btn"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
