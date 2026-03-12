import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main className="main-container">
      <div className="header">
        <h1 className="header-title">📝 Todo App</h1>
        <p className="header-subtitle">Stay organized and get things done</p>
      </div>
      <TodoList />
    </main>
  );
}
