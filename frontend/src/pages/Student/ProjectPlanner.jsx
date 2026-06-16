import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { ProgressLine } from '../../components/common/PageState.jsx';
import { projectService } from '../../services/projectService.js';

const ProjectPlanner = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('All');
  const { register, handleSubmit, reset } = useForm({ defaultValues: { status: 'Planning', technologies: '' } });
  const load = () => projectService.getProjects({ status }).then((res) => setProjects(res.data));
  useEffect(() => { load(); }, [status]);
  const submit = async (data) => { await projectService.createProject({ ...data, technologies: String(data.technologies || '').split(',').map((x) => x.trim()).filter(Boolean) }); toast.success('Project added'); reset(); load(); };
  return <AppShell title="Project Planner"><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><form onSubmit={handleSubmit(submit)} className="space-y-3 rounded-lg bg-white p-5 border"><h3 className="font-semibold">Add Project</h3><input {...register('title', { required: true })} placeholder="Title" className="w-full rounded border p-3" /><textarea {...register('description')} placeholder="Description" className="w-full rounded border p-3" /><input {...register('technologies')} placeholder="Technologies, comma separated" className="w-full rounded border p-3" /><input {...register('githubLink')} placeholder="GitHub link" className="w-full rounded border p-3" /><input {...register('liveDemoUrl')} placeholder="Live demo URL" className="w-full rounded border p-3" /><select {...register('status')} className="w-full rounded border p-3"><option>Planning</option><option>In Progress</option><option>Completed</option></select><button className="w-full rounded bg-indigo-600 p-3 text-white">Save Project</button></form><section><select value={status} onChange={(e) => setStatus(e.target.value)} className="mb-4 rounded border p-3"><option>All</option><option>Planning</option><option>In Progress</option><option>Completed</option></select><div className="grid gap-4 md:grid-cols-2">{projects.map((p) => <article key={p._id} className="rounded-lg bg-white p-5 border"><h3 className="font-semibold">{p.title}</h3><p className="mt-1 text-sm text-slate-600">{p.description}</p><div className="mt-3 flex flex-wrap gap-2">{p.technologies.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div><p className="mt-3 text-sm">{p.status}</p><ProgressLine value={p.progressPercentage} /></article>)}</div></section></div></AppShell>;
};
export default ProjectPlanner;
