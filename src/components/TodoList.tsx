'use client';

import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import TodoItem, { TodoData } from './TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch {
      setError('Failed to load todos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (title: string, description: string) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: description || null }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create todo');
    }
    const newTodo = await res.json();
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete todo');
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdate = async (id: number, title: string, description: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: description || null }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update todo');
    }
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading your todos...</p>
      </div>
    );
  }

  return (
    <div>
      <TodoForm onAdd={handleAdd} />

      {error && <div className="error-message">{error}</div>}

      {todos.length > 0 && (
        <div className="stats-bar">
          <span>
            <strong>{todos.length}</strong> total · <strong>{pendingCount}</strong> pending · <strong>{completedCount}</strong> completed
          </span>
          <span>
            {completedCount > 0 && pendingCount === 0
              ? '🎉 All done!'
              : `${Math.round((completedCount / todos.length) * 100)}% complete`}
          </span>
        </div>
      )}

      {todos.length === 0 ? (
        <div className="todo-empty">
          <div className="empty-icon">📋</div>
          <p>No todos yet!</p>
          <p>Add your first todo above to get started.</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
