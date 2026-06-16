import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { ProgressLine } from '../../components/common/PageState.jsx';
import { gapAnalysisService } from '../../services/gapAnalysisService.js';

const GapAnalysis = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    gapAnalysisService.getGapAnalysis()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load gap analysis right now.'));
  }, []);
  if (error) return <AppShell title="Gap Analysis"><section className="rounded-lg bg-white p-6 shadow-sm border"><h3 className="font-semibold text-red-700">Gap analysis failed</h3><p className="mt-2 text-sm text-slate-600">{error}</p><button onClick={() => window.location.reload()} className="mt-4 rounded-lg border px-4 py-2">Retry</button></section></AppShell>;
  if (!data) return <AppShell title="Gap Analysis"><section className="rounded-lg bg-white p-6 shadow-sm border"><p className="text-sm text-slate-600">Loading gap analysis...</p></section></AppShell>;
  return <AppShell title="Gap Analysis"><div className="space-y-6">
    <section className="grid gap-4 md:grid-cols-3"><div className="rounded-lg bg-white p-6 shadow-sm border"><p className="text-sm text-slate-500">Target Role</p><h3 className="text-xl font-semibold">{data.role?.roleName}</h3><p className="mt-2 text-sm text-slate-600">{data.role?.description}</p></div><div className="rounded-lg bg-white p-6 shadow-sm border"><p className="text-sm text-slate-500">Overall Match</p><p className="text-5xl font-bold text-indigo-700">{data.matchPercentage}%</p><ProgressLine value={data.matchPercentage} /></div><div className="rounded-lg bg-white p-6 shadow-sm border"><p className="text-sm text-slate-500">Your Skills</p><p className="text-5xl font-bold">{data.userSkills.length}</p></div></section>
    <section className="grid gap-4 lg:grid-cols-2"><div className="rounded-lg bg-white p-5 border"><h3 className="font-semibold">Missing Skills</h3><div className="mt-3 flex flex-wrap gap-2">{data.missingSkills.map((s) => <span key={s.skillName} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">{s.skillName}</span>)}</div></div><div className="rounded-lg bg-white p-5 border"><h3 className="font-semibold">Need Improvement</h3><div className="mt-3 space-y-2">{data.improvementSkills.map((s) => <p key={s.skillName} className="text-sm">{s.skillName}: {s.currentLevel} to {s.requiredLevel}</p>)}</div></div></section>
    <section className="rounded-lg bg-white p-5 border"><h3 className="font-semibold">Priority Recommendations</h3><div className="mt-3 grid gap-3 md:grid-cols-2">{data.recommendations.map((r) => <div key={r.skillName} className="rounded-lg bg-slate-50 p-3"><p className="font-medium">{r.skillName}</p><p className="text-sm text-slate-500">{r.estimatedTime}</p></div>)}</div><div className="mt-5 flex gap-3"><button onClick={() => navigate('/skills')} className="rounded-lg border px-4 py-2">Add Missing Skill</button><button onClick={() => navigate('/roadmap')} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Generate Roadmap from Gaps</button></div></section>
  </div></AppShell>;
};
export default GapAnalysis;
