import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { ProgressLine } from '../../components/common/PageState.jsx';
import { skillService } from '../../services/skillService.js';

const labels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const SkillInventory = () => {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState({ search: '', category: 'All' });
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { category: 'Technical', proficiencyLevel: 1, yearsOfExperience: 0, evidence: { type: 'None' } } });
  const load = async () => { const res = await skillService.getSkills(query); setSkills(res.data.items); };
  useEffect(() => { load(); }, [query.category]);
  const submit = async (data) => {
    const payload = {
      ...data,
      proficiencyLevel: Number(data.proficiencyLevel),
      yearsOfExperience: Number(data.yearsOfExperience) || 0,
    };
    editing ? await skillService.updateSkill(editing._id, payload) : await skillService.addSkill(payload);
    toast.success(editing ? 'Skill updated' : 'Skill added');
    setEditing(null);
    reset();
    load();
  };
  const edit = (skill) => { setEditing(skill); reset(skill); };
  const remove = async (id) => { if (confirm('Delete this skill?')) { await skillService.deleteSkill(id); toast.success('Skill deleted'); load(); } };
  return <AppShell title="Skill Inventory"><div className="grid gap-6 lg:grid-cols-[360px_1fr]">
    <form onSubmit={handleSubmit(submit)} className="space-y-3 rounded-lg bg-white p-5 shadow-sm border">
      <h3 className="font-semibold">{editing ? 'Edit Skill' : 'Add Skill'}</h3>
      <input {...register('skillName', { required: true })} placeholder="Skill name" className="w-full rounded-lg border p-3" />
      <select {...register('category')} className="w-full rounded-lg border p-3"><option>Technical</option><option>Soft Skill</option><option>Language</option><option>Tool</option></select>
      <input {...register('proficiencyLevel')} type="range" min="1" max="4" className="w-full" />
      <input {...register('yearsOfExperience')} type="number" min="0" placeholder="Years" className="w-full rounded-lg border p-3" />
      <select {...register('evidence.type')} className="w-full rounded-lg border p-3"><option>None</option><option>Certificate</option><option>Project</option><option>Work Experience</option><option>Course</option></select>
      <input {...register('evidence.link')} placeholder="Evidence link" className="w-full rounded-lg border p-3" />
      <textarea {...register('evidence.description')} placeholder="Evidence description" className="w-full rounded-lg border p-3" />
      <button className="w-full rounded-lg bg-indigo-600 p-3 text-white">{editing ? 'Save Skill' : 'Add Skill'}</button>
    </form>
    <section className="space-y-4">
      <div className="flex gap-3"><input value={query.search} onChange={(e) => setQuery({ ...query, search: e.target.value })} placeholder="Search skills" className="flex-1 rounded-lg border p-3" /><button onClick={load} className="rounded-lg border px-4">Search</button><select value={query.category} onChange={(e) => setQuery({ ...query, category: e.target.value })} className="rounded-lg border p-3"><option>All</option><option>Technical</option><option>Soft Skill</option><option>Language</option><option>Tool</option></select></div>
      <div className="grid gap-4 md:grid-cols-2">{skills.map((skill) => <article key={skill._id} className="rounded-lg bg-white p-5 shadow-sm border"><div className="flex justify-between"><h3 className="font-semibold">{skill.skillName}</h3><span className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">{skill.category}</span></div><p className="mt-3 text-sm">{labels[skill.proficiencyLevel - 1]}</p><ProgressLine value={skill.proficiencyLevel * 25} /><p className="mt-2 text-sm text-slate-500">{skill.yearsOfExperience} years</p>{skill.evidence?.link && <a className="text-sm text-indigo-600" href={skill.evidence.link} target="_blank">Evidence</a>}<div className="mt-4 flex gap-2"><button onClick={() => edit(skill)} className="rounded border px-3 py-1 text-sm">Edit</button><button onClick={() => remove(skill._id)} className="rounded border px-3 py-1 text-sm text-red-600">Delete</button></div></article>)}</div>
    </section>
  </div></AppShell>;
};
export default SkillInventory;
