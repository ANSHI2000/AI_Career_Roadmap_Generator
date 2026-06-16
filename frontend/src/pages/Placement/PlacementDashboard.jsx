import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { dashboardService } from '../../services/dashboardService.js';

export default function PlacementDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const students = analytics?.students || [];
  const roleGroups = students.reduce((acc, student) => {
    const role = student.targetRole || 'Not set';
    acc[role] = acc[role] || { role, ready: 0, total: 0 };
    acc[role].total += 1;
    if (student.readinessScore >= 70) acc[role].ready += 1;
    return acc;
  }, {});
  const stats = [
    { label: 'Total Students', value: analytics?.totalStudents || 0, change: 'verified' },
    { label: 'Ready for Placement', value: analytics?.readyStudents || 0, change: '70+ score' },
    { label: 'Average Readiness', value: `${analytics?.averageReadiness || 0}%`, change: 'live' },
    { label: 'Reports', value: analytics?.reports?.length || 0, change: 'available' },
  ];

  useEffect(() => {
    dashboardService.getPlacementAnalytics().then((res) => setAnalytics(res.data)).catch(() => setAnalytics({ students: [] }));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Placement Dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Track student readiness and placement metrics.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{stat.change}</p>
            </Card>
          ))}
        </div>

        <Card title="Role-wise Readiness" description="Students ready by target role">
          <div className="space-y-4">
            {Object.values(roleGroups).map((item) => (
              <div key={item.role}>
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{item.role}</p>
                  <p className="text-slate-600 dark:text-slate-400">{item.ready}/{item.total}</p>
                </div>
                <ProgressBar percentage={Math.round((item.ready / item.total) * 100)} />
              </div>
            ))}
            {!Object.keys(roleGroups).length && <p className="text-sm text-slate-500">No verified student readiness data yet.</p>}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
