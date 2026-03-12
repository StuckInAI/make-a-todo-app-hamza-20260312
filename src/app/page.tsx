import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main className="main-container">
      <div className="header">
        <h1 className="app-title">📝 Todo App</h1>
        <p className="app-subtitle">Stay organized, get things done</p>
      </div>
      <TodoList />
    </main>
  );
}
