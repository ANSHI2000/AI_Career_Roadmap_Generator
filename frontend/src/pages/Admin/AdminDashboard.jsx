import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: 450, change: '+45' },
    { label: 'Active Courses', value: 28, change: '+3' },
    { label: 'Mentors', value: 35, change: '+2' },
    { label: 'System Health', value: '99.8%', change: 'Excellent' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">System overview and configuration management.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              <p className="mt-1 text-xs text-emerald-600">{stat.change}</p>
            </Card>
          ))}
        </div>

        <Card title="System Status" description="Platform health and metrics">
          <div className="space-y-3">
            {[
              { name: 'Database', status: 'Healthy', uptime: '99.9%' },
              { name: 'API Server', status: 'Healthy', uptime: '99.8%' },
              { name: 'Email Service', status: 'Operational', uptime: '100%' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{service.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Uptime: {service.uptime}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  ● {service.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
