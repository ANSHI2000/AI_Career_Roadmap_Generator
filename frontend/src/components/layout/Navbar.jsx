import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, UserCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants/routeConstants.js';

export function Navbar({ onToggleSidebar }) {
  const { auth, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { label: 'Home', to: ROUTES.HOME },
    { label: 'Student', to: ROUTES.STUDENT_DASHBOARD },
    { label: 'Mentor', to: ROUTES.MENTOR_DASHBOARD },
    { label: 'Placement', to: ROUTES.PLACEMENT_DASHBOARD },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onToggleSidebar} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
            <Menu className="h-5 w-5" />
          </button>
          <Link to={ROUTES.HOME} className="text-lg font-semibold text-brand-700 dark:text-brand-300">ACRG</Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link key={item.label} to={item.to} className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            <UserCircle2 className="h-5 w-5" />
            {auth?.user?.name || 'Guest'}
          </button>
          {open && (
            <div className="absolute right-4 top-20 z-40 w-48 rounded-3xl border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-700 dark:bg-slate-950">
              <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                <UserCircle2 className="h-4 w-4" /> Profile
              </button>
              <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-800">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
