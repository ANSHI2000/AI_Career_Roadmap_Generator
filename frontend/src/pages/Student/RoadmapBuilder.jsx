import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { ProgressLine } from '../../components/common/PageState.jsx';
import { roadmapService } from '../../services/roadmapService.js';

const RoadmapBuilder = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [timeline, setTimeline] = useState('6 months');
  const [learningIntensity, setLearningIntensity] = useState('Moderate');
  const load = () => roadmapService.list().then((res) => setRoadmaps(res.data));
  useEffect(() => { load(); }, []);
  const generate = async () => { const res = await roadmapService.generateRoadmap({ timeline, learningIntensity }); toast.success(res.message); load(); };
  const updateTask = async (roadmap, taskId, isCompleted) => {
    roadmap.phases.forEach((p) => p.milestones.forEach((m) => m.tasks.forEach((t) => { if (t._id === taskId) t.isCompleted = isCompleted; })));
    await roadmapService.update(roadmap._id, roadmap); load();
  };
  return <AppShell title="Roadmap Builder"><div className="space-y-6"><section className="rounded-lg bg-white p-5 border shadow-sm"><div className="grid gap-3 md:grid-cols-3"><select value={timeline} onChange={(e) => setTimeline(e.target.value)} className="rounded border p-3"><option>3 months</option><option>6 months</option><option>12 months</option></select><select value={learningIntensity} onChange={(e) => setLearningIntensity(e.target.value)} className="rounded border p-3"><option>Casual</option><option>Moderate</option><option>Intense</option></select><button onClick={generate} className="rounded bg-indigo-600 p-3 text-white">Generate AI Roadmap</button></div></section>{roadmaps.map((roadmap) => <article key={roadmap._id} className="rounded-lg bg-white p-5 border shadow-sm"><div className="flex justify-between gap-3"><div><h3 className="text-xl font-semibold">{roadmap.title}</h3><p className="text-sm text-slate-500">{roadmap.targetRole} • {roadmap.timeline}</p></div><button onClick={() => roadmapService.setActive(roadmap._id).then(load)} className="rounded border px-3 py-1 text-sm">{roadmap.isActive ? 'Active' : 'Set Active'}</button></div><div className="mt-4"><ProgressLine value={roadmap.completionPercentage} /></div><div className="mt-5 space-y-3">{roadmap.phases.map((phase) => <details key={phase._id} open className="rounded-lg border p-4"><summary className="cursor-pointer font-semibold">{phase.title}</summary><div className="mt-3 space-y-3">{phase.milestones.map((m) => <div key={m._id} className="rounded bg-slate-50 p-3"><p className="font-medium">{m.title}</p>{m.tasks.map((t) => <label key={t._id} className="mt-2 flex gap-2 text-sm"><input type="checkbox" checked={t.isCompleted} onChange={(e) => updateTask(roadmap, t._id, e.target.checked)} />{t.title}</label>)}</div>)}</div></details>)}</div></article>)}</div></AppShell>;
};
export default RoadmapBuilder;
