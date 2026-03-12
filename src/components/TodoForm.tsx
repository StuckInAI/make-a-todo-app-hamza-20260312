'use client';

import { useState, FormEvent } from 'react';

interface TodoFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    setError(null);
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
  }

  return (
    <div className="form-card">
      <h2>➕ Add New Todo</h2>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={loading}
            maxLength={200}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>(optional)</span></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            disabled={loading}
            maxLength={1000}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
    </div>
  );
}
