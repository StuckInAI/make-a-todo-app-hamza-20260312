import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main>
      <div className="app-header">
        <span className="app-icon">✅</span>
        <h1>Todo App</h1>
      </div>
      <p className="subtitle">Stay organised. Get things done.</p>
      <TodoList />
    </main>
  );
}
