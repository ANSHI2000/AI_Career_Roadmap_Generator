import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { Footer } from './Footer.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export function DashboardLayout({ children }) {
  const { auth } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar role={auth?.user?.role} />
        <main className="min-w-0 flex-1 space-y-6">
          {children || <Outlet />}
        </main>
      </div>
      <Footer />
    </div>
  );
}
