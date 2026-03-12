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
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  async function handleToggle() {
    setToggling(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setToggling(false);
    }
  }

  async function handleSaveEdit() {
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty.');
      return;
    }
    setEditError(null);
    setSaving(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    } catch {
      setEditError('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditError(null);
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${todo.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <div className="todo-header">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={toggling}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        />
        <div className="todo-content">
          <div className="todo-title">{todo.title}</div>
          {todo.description && (
            <div className="todo-description">{todo.description}</div>
          )}
          <div className="todo-meta">
            <span className={`badge ${todo.completed ? 'badge-done' : 'badge-pending'}`}>
              {todo.completed ? 'Done' : 'Pending'}
            </span>
            {' · '}
            Created {formatDate(todo.createdAt)}
          </div>
        </div>
        <div className="todo-actions">
          {!isEditing && (
            <button
              className="btn btn-ghost"
              onClick={() => setIsEditing(true)}
              disabled={deleting}
              aria-label="Edit todo"
            >
              ✏️ Edit
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting || saving}
            aria-label="Delete todo"
          >
            {deleting ? '...' : '🗑️ Delete'}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-form">
          {editError && <div className="error-banner">{editError}</div>}
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            disabled={saving}
            maxLength={200}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            disabled={saving}
            maxLength={1000}
          />
          <div className="edit-form-actions">
            <button
              className="btn btn-success"
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
