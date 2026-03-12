'use client';

import { useEffect, useState, useCallback } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: Todo[] = await res.json();
      setTodos(data);
      setError('');
    } catch {
      setError('Failed to load todos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const completed = todos.filter((t) => t.completed).length;
  const total = todos.length;

  return (
    <div>
      <TodoForm onTodoAdded={fetchTodos} />

      {error && <div className="error-msg">{error}</div>}

      <div className="stats-bar">
        <div className="stat-chip">Total: <span>{total}</span></div>
        <div className="stat-chip">Completed: <span>{completed}</span></div>
        <div className="stat-chip">Remaining: <span>{total - completed}</span></div>
      </div>

      {loading ? (
        <div className="loading-state">Loading todos…</div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No todos yet!</p>
          <small>Add your first todo above to get started.</small>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdated={fetchTodos}
              onDeleted={fetchTodos}
            />
          ))}
        </div>
      )}
    </div>
  );
}
