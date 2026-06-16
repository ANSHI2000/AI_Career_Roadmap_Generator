import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { ProgressLine } from '../../components/common/PageState.jsx';
import { progressService } from '../../services/progressService.js';

const ProgressTracking = () => {
  const [overview, setOverview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const load = async () => { const [o, t] = await Promise.all([progressService.overview(), progressService.tasks()]); setOverview(o.data); setTasks(t.data); };
  useEffect(() => { load(); }, []);
  const toggle = async (task) => { await progressService.completeTask(task._id, { isCompleted: !task.isCompleted }); toast.success('Task updated'); load(); };
  return <AppShell title="Progress Tracking"><div className="space-y-6"><section className="rounded-lg bg-white p-6 border"><p className="text-sm text-slate-500">Overall Progress</p><p className="text-5xl font-bold text-indigo-700">{overview?.completion || 0}%</p><ProgressLine value={overview?.completion || 0} /><p className="mt-2 text-sm">{overview?.completedTasks || 0} of {overview?.totalTasks || 0} tasks complete • Streak {overview?.streak || 0} day</p></section><section className="rounded-lg bg-white p-5 border"><h3 className="font-semibold">Pending Tasks</h3><div className="mt-4 space-y-2">{tasks.map((task) => <label key={task._id} className="flex items-center gap-3 rounded bg-slate-50 p-3"><input type="checkbox" checked={task.isCompleted} onChange={() => toggle(task)} /><span className={task.isCompleted ? 'line-through text-slate-400' : ''}>{task.title}</span><span className="ml-auto text-xs text-slate-500">{task.milestoneTitle}</span></label>)}</div></section></div></AppShell>;
};
export default ProgressTracking;
