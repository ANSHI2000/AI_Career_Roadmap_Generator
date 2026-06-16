import { Bell, Briefcase, ChartNoAxesColumnIncreasing, ClipboardCheck, FolderKanban, Gauge, GitCompare, GraduationCap, LogOut, Map, Menu, Target, User, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/routeConstants.js';

const navItems = [
  { label: 'Dashboard', to: ROUTES.STUDENT_DASHBOARD, icon: Gauge },
  { label: 'Profile', to: ROUTES.CAREER_PROFILE, icon: User },
  { label: 'Goals', to: ROUTES.GOAL_SELECTION, icon: Target },
  { label: 'Skills', to: ROUTES.SKILL_INVENTORY, icon: GraduationCap },
  { label: 'Gap Analysis', to: ROUTES.GAP_ANALYSIS, icon: GitCompare },
  { label: 'Roadmap', to: ROUTES.ROADMAP_BUILDER, icon: Map },
  { label: 'Progress', to: ROUTES.PROGRESS_TRACKING, icon: ChartNoAxesColumnIncreasing },
  { label: 'Projects', to: ROUTES.PROJECT_PLANNER, icon: FolderKanban },
  { label: 'Mentor Review', to: ROUTES.MENTOR_REVIEW, icon: ClipboardCheck },
  { label: 'Notifications', to: ROUTES.NOTIFICATIONS, icon: Bell },
];

export function AppShell({ title, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <Link to="/dashboard" className="flex items-center gap-2 text-lg font-bold text-indigo-700">
          <Briefcase className="h-5 w-5" /> ACRG
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(false)} type="button">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive || location.pathname === item.to
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" /> {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <button onClick={handleLogout} type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{sidebar}</div>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)}>{sidebar}</div>}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-slate-200 p-2 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">AI Career Roadmap</p>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
          </div>
          <Link to="/profile" className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium">
            <User className="h-4 w-4" /> {user?.name || 'Profile'}
          </Link>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
