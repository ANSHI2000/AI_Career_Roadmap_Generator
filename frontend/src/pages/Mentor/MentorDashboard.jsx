import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routeConstants.js';
import { mentorService } from '../../services/mentorService.js';

export default function MentorDashboard() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    mentorService.listStudents().then((res) => setReviews(res.data || [])).catch(() => setReviews([]));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Mentor Dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Manage your mentees and provide guidance on their career journeys.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Pending Reviews', value: reviews.length },
            { label: 'In Review', value: reviews.filter((review) => review.status === 'In Review').length },
            { label: 'Resubmitted', value: reviews.filter((review) => review.status === 'Resubmitted').length },
          ].map((stat, i) => (
            <Card key={i}>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card title="Assigned Students" description="Students under your mentorship">
          <div className="space-y-3">
            {reviews.map((review) => {
              const student = review.userId || {};
              const roadmap = review.roadmapId || {};
              return (
              <div key={review._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{student.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Target: {roadmap.targetRole || student.studentProfile?.targetRole || 'Not set'}</p>
                  <p className="text-xs text-slate-500">{review.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{roadmap.completionPercentage || 0}%</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Progress</p>
                  </div>
                  <Link to={ROUTES.STUDENT_DETAIL.replace(':id', student._id || review._id)} className="text-sm">
                    <Button size="sm">Review</Button>
                  </Link>
                </div>
              </div>
            );})}
            {!reviews.length && <p className="text-sm text-slate-500">No student review requests yet.</p>}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
