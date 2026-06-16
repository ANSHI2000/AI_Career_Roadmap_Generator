import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-700 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} AI Career Roadmap Generator. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <Link to="/login" className="hover:text-brand-600">Login</Link>
          <Link to="/register" className="hover:text-brand-600">Register</Link>
        </div>
      </div>
    </footer>
  );
}
