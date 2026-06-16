import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';

export default function StudentDetail() {
  const { id } = useParams();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Student Profile</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Review {id} progress and roadmap details.</p>
        </div>

        <Card title="Student Information" description="Basic details">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Name:</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">John Doe</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Target Role:</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Full Stack Developer</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Timeline:</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">6 months</p>
            </div>
          </div>
        </Card>

        <Card title="Roadmap Progress" description="Current status">
          <ProgressBar percentage={35} label="Overall Completion" />
        </Card>

        <Card title="Skills" description="Current and target skills">
          <div className="space-y-3">
            {[
              { name: 'JavaScript', level: 'Intermediate' },
              { name: 'React', level: 'Beginner' },
              { name: 'Node.js', level: 'Not Started' },
            ].map((skill) => (
              <div key={skill.name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <span className="text-sm font-medium">{skill.name}</span>
                <Badge variant={skill.level === 'Intermediate' ? 'success' : 'warning'}>{skill.level}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Button>Provide Feedback</Button>
      </div>
    </DashboardLayout>
  );
}
