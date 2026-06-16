import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Download } from 'lucide-react';

export default function Reports() {
  const reports = [
    { name: 'Monthly Placement Report', date: '2024-02-01', type: 'PDF' },
    { name: 'Student Readiness Analysis', date: '2024-01-15', type: 'XLSX' },
    { name: 'Skill Gap Report', date: '2024-01-01', type: 'PDF' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Reports</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Generate and download placement reports.</p>
        </div>

        <Card title="Quick Reports" description="Generate common reports">
          <div className="space-y-3">
            {[
              'Monthly Placement Summary',
              'Student Readiness Assessment',
              'Skill Distribution Report',
            ].map((report) => (
              <div key={report} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="font-medium text-slate-900 dark:text-slate-100">{report}</p>
                <Button size="sm">Generate</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Reports" description="Download previously generated reports">
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{report.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{report.date} • {report.type}</p>
                </div>
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
