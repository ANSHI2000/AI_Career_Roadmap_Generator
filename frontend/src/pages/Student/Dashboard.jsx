import { useQuery } from 'react-query';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { motion } from 'framer-motion';
import { TrendingUp, Target, CheckCircle2, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const { data: stats, isLoading } = useQuery('studentStats', async () => {
    return {
      skillsAdded: 5,
      goalsSet: 2,
      roadmapProgress: 35,
      nextMilestone: 'Complete Python Basics',
      recentActivities: [
        { id: 1, title: 'Added skill: JavaScript', date: '2 hours ago' },
        { id: 2, title: 'Set career goal: Full Stack Developer', date: '1 day ago' },
      ],
    };
  });

  if (isLoading) return <Loader fullScreen />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome back!</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Here's your career roadmap progress at a glance.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Target, label: 'Goals Set', value: stats.goalsSet },
            { icon: TrendingUp, label: 'Skills Added', value: stats.skillsAdded },
            { icon: CheckCircle2, label: 'Milestones', value: 3 },
            { icon: Clock, label: 'Timeline', value: '6 months' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card title="Roadmap Progress" description="Your personalized career roadmap">
          <div className="space-y-6">
            <ProgressBar percentage={stats.roadmapProgress} label="Overall Progress" />
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{stats.nextMilestone}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Next milestone</p>
                </div>
                <Badge variant="info">In Progress</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recent Activity" description="Latest updates from your profile">
          <div className="space-y-3">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 dark:border-slate-700">
                <p className="text-sm text-slate-700 dark:text-slate-200">{activity.title}</p>
                <p className="text-xs text-slate-500">{activity.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
