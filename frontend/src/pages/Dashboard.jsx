import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FolderPlus, GitCompare, Map, TrendingUp } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ProgressLine, Skeleton } from '../components/common/PageState.jsx';
import { dashboardService } from '../services/dashboardService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../utils/roleRouting.js';

const quickActions = [
  { label: 'Add New Skill', to: '/skills', icon: BookOpen },
  { label: 'Generate Roadmap', to: '/roadmap', icon: Map },
  { label: 'View Gap Analysis', to: '/gap-analysis', icon: GitCompare },
  { label: 'Upload Project', to: '/projects', icon: FolderPlus },
];

function StatCard({ title, value, suffix = '%', onClick }) {
  return (
    <motion.button whileHover={{ y: -2 }} type="button" onClick={onClick} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}{suffix}</p>
      <div className="mt-4"><ProgressLine value={value} /></div>
    </motion.button>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, stats: null, activity: [], next: null });

  useEffect(() => {
    const dashboardPath = getDashboardPathForRole(user?.role);
    if (dashboardPath !== '/dashboard') navigate(dashboardPath, { replace: true });
  }, [navigate, user?.role]);

  const load = async () => {
    const [stats, activity, next] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentActivity(),
      dashboardService.getNextAction(),
    ]);
    setState({ loading: false, stats: stats.data, activity: activity.data, next: next.data });
  };

  useEffect(() => {
    load().catch(() => setState((prev) => ({ ...prev, loading: false })));
    const timer = setInterval(() => load().catch(() => {}), 30000);
    return () => clearInterval(timer);
  }, []);

  const { loading, stats, activity, next } = state;
  const coverage = stats?.skillCoverage || { acquired: 0, required: 0 };
  const donut = [
    { name: 'Acquired', value: coverage.acquired },
    { name: 'Missing', value: Math.max((coverage.required || 0) - (coverage.acquired || 0), 0) },
  ];

  return (
    <AppShell title="Dashboard">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-4"><Skeleton className="h-40" /><Skeleton className="h-40" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-lg bg-indigo-700 p-6 text-white shadow-sm">
            <p className="text-sm text-indigo-100">Welcome back</p>
            <h2 className="mt-1 text-3xl font-bold">{stats?.user?.name || 'Learner'}</h2>
            <p className="mt-2 max-w-2xl text-indigo-100">Your roadmap, skills, and progress are synced from your workspace data.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <StatCard title="Readiness Score" value={stats?.readinessScore || 0} onClick={() => navigate('/gap-analysis')} />
            <StatCard title="Roadmap Completion" value={stats?.roadmapCompletion || 0} onClick={() => navigate('/roadmap')} />
            <StatCard title="Profile Completion" value={stats?.profileCompletion || 0} onClick={() => navigate('/profile')} />
            <button type="button" onClick={() => navigate('/skills')} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-sm text-slate-500">Skill Coverage</p>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={donut} innerRadius={28} outerRadius={44} dataKey="value"><Cell fill="#4f46e5" /><Cell fill="#e2e8f0" /></Pie></PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm font-medium">{coverage.acquired || 0} of {coverage.required || 0} required skills</p>
            </button>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <button type="button" onClick={() => navigate('/roadmap')} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm lg:col-span-2">
              <p className="text-sm text-slate-500">Active Roadmap</p>
              <h3 className="mt-2 text-xl font-semibold">{stats?.activeRoadmap?.title || 'No active roadmap yet'}</h3>
              <p className="mt-1 text-sm text-slate-600">{stats?.activeRoadmap?.targetRole || 'Generate one from your gaps to begin.'}</p>
              <div className="mt-4"><ProgressLine value={stats?.roadmapCompletion || 0} /></div>
            </button>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-700"><TrendingUp className="h-5 w-5" /><p className="text-sm font-medium">Next Action</p></div>
              <h3 className="mt-3 text-lg font-semibold">{next?.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{next?.description}</p>
              <button onClick={() => navigate(next?.navigateTo || '/profile')} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{next?.buttonText || 'Continue'}</button>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="mt-4 space-y-3">
                {activity.length ? activity.map((item, index) => (
                  <button key={index} onClick={() => item.link && navigate(item.link)} className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-left text-sm">
                    <span>{item.action}</span><span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                  </button>
                )) : <p className="text-sm text-slate-500">Your actions will appear here.</p>}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="mt-4 grid gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return <button key={action.to} onClick={() => navigate(action.to)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"><Icon className="h-4 w-4" />{action.label}</button>;
                })}
              </div>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
};

export default Dashboard;
