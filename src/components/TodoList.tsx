'use client';

import { Todo, FilterType } from '../app/page';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  totalCount: number;
  onToggle: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoList({
  todos,
  loading,
  filter,
  setFilter,
  totalCount,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div>
      <div className="todo-list-header">
        <h2>My Todos</h2>
        <span className="todo-count">{totalCount}</span>
      </div>

      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading todos...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="todo-empty">
          <div className="empty-icon">
            {filter === 'completed' ? '🎉' : filter === 'active' ? '🎯' : '📝'}
          </div>
          <p>
            {filter === 'completed'
              ? 'No completed todos yet.'
              : filter === 'active'
              ? 'No active todos. Great job!'
              : 'No todos yet. Add one above!'}
          </p>
        </div>
      ) : (
        <div className="todos-container">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
