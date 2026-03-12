'use client';

import { useState } from 'react';

interface TodoFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    } catch {
      setError('Failed to add todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>✨ Add New Todo</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="todo-title">Title *</label>
        <input
          id="todo-title"
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="todo-description">Description</label>
        <textarea
          id="todo-description"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)..."
          disabled={loading}
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="form-submit-btn"
        disabled={loading || !title.trim()}
      >
        {loading ? 'Adding...' : '+ Add Todo'}
      </button>
    </form>
  );
}
