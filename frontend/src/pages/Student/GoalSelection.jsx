import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { careerService } from '../../services/careerService.js';

const GoalSelection = () => {
  const [roles, setRoles] = useState([]);
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({ defaultValues: { desiredSalaryRange: { min: 3, max: 20 }, weeklyTimeCommitment: 10 } });
  const toText = (value) => Array.isArray(value) ? value.join(', ') : value || '';
  const toList = (value) => Array.isArray(value) ? value : String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
  useEffect(() => { Promise.all([careerService.getCareerRoles(), careerService.getGoals()]).then(([r, g]) => { setRoles(r.data); if (g.data) reset({ ...g.data, targetIndustry: toText(g.data.targetIndustry), targetCompanyTypes: toText(g.data.targetCompanyTypes) }); }); }, []);
  const onSubmit = async (data) => { const res = await careerService.saveGoals({ ...data, targetIndustry: toList(data.targetIndustry), targetCompanyTypes: toList(data.targetCompanyTypes) }); toast.success(res.message); reset({ ...res.data, targetIndustry: toText(res.data.targetIndustry), targetCompanyTypes: toText(res.data.targetCompanyTypes) }); };
  const recommend = async () => { const res = await careerService.recommend({}); setValue('targetRole', res.data.targetRole); toast.success(res.data.reason); };
  return <AppShell title="Goal Selection"><form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg bg-white p-6 shadow-sm border">
    <div className="grid gap-4 md:grid-cols-2">
      <select {...register('targetRole', { required: true })} className="rounded-lg border p-3"><option value="">Target Career Role</option>{roles.map((r) => <option key={r._id}>{r.roleName}</option>)}</select>
      <input {...register('targetIndustry')} placeholder="Target industries, comma separated" className="rounded-lg border p-3" />
      <input {...register('targetCompanyTypes')} placeholder="Company types: Startup, FAANG, Remote" className="rounded-lg border p-3" />
      <input {...register('desiredSalaryRange.max')} type="range" min="3" max="50" className="p-3" />
      <select {...register('targetTimeline')} className="rounded-lg border p-3"><option>3 months</option><option>6 months</option><option>1 year</option><option>2 years</option></select>
      <select {...register('preferredLearningStyle')} className="rounded-lg border p-3"><option>Self-paced</option><option>Structured course</option><option>Bootcamp</option></select>
      <select {...register('weeklyTimeCommitment')} className="rounded-lg border p-3"><option value="5">5 hours</option><option value="10">10 hours</option><option value="20">20 hours</option><option value="30">30+ hours</option></select>
    </div>
    <div className="flex gap-3"><button className="rounded-lg bg-indigo-600 px-5 py-2 text-white">{isSubmitting ? 'Saving...' : 'Save Goal'}</button><button type="button" onClick={recommend} className="rounded-lg border px-5 py-2">Get Recommendations</button></div>
  </form></AppShell>;
};
export default GoalSelection;
