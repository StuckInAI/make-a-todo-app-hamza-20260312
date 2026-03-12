'use client';

import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

type Filter = 'all' | 'pending' | 'completed';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json() as Todo[];
      setTodos(data);
    } catch {
      setError('Could not load todos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  async function handleAdd(title: string, description: string) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: description || null }),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      throw new Error(data.error || 'Failed to create todo');
    }
    const newTodo = await res.json() as Todo;
    setTodos((prev) => [newTodo, ...prev]);
  }

  async function handleToggle(id: number, completed: boolean) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    const updated = await res.json() as Todo;
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleUpdate(id: number, title: string, description: string) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: description || null }),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      throw new Error(data.error || 'Failed to update todo');
    }
    const updated = await res.json() as Todo;
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete todo');
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div>
      <TodoForm onAdd={handleAdd} />

      {error && <div className="error-banner">{error}</div>}

      <div className="filters">
        <button
          className={`filter-btn${filter === 'all' ? ' active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn${filter === 'pending' ? ' active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`filter-btn${filter === 'completed' ? ' active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
        {filteredTodos.length > 0 && (
          <span className="todo-count">
            Showing {filteredTodos.length} item{filteredTodos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading todos...</p>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="todo-empty">
          <div className="todo-empty-icon">
            {filter === 'completed' ? '🎉' : filter === 'pending' ? '🌟' : '📝'}
          </div>
          <p>
            {filter === 'completed'
              ? 'No completed todos yet.'
              : filter === 'pending'
              ? 'No pending todos — great job!'
              : 'No todos yet. Add one above!'}
          </p>
        </div>
      ) : (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
