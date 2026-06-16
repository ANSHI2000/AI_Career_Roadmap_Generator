import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { mentorService } from '../../services/mentorService.js';
import { roadmapService } from '../../services/roadmapService.js';

const MentorReview = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [status, setStatus] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { register, handleSubmit } = useForm();
  const load = async () => { const [r, s, f] = await Promise.all([roadmapService.list(), mentorService.getReviewStatus(), mentorService.getFeedback()]); setRoadmaps(r.data); setStatus(s.data); setFeedback(f.data); };
  useEffect(() => { load(); }, []);
  const submit = async (data) => { await mentorService.requestReview(data); toast.success('Review requested'); load(); };
  return <AppShell title="Mentor Review"><div className="grid gap-6 lg:grid-cols-2"><form onSubmit={handleSubmit(submit)} className="space-y-3 rounded-lg bg-white p-5 border"><h3 className="font-semibold">Submit for Review</h3><select {...register('roadmapId', { required: true })} className="w-full rounded border p-3"><option value="">Select roadmap</option>{roadmaps.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}</select><textarea {...register('notes')} placeholder="Notes to mentor" className="w-full rounded border p-3" /><button className="rounded bg-indigo-600 px-4 py-2 text-white">Request Review</button></form><section className="space-y-4"><div className="rounded-lg bg-white p-5 border"><h3 className="font-semibold">Review Status</h3><p className="mt-2 text-sm">Status: {status?.status || 'No request yet'}</p><p className="text-sm">Expected: {status?.expectedResponseDate ? new Date(status.expectedResponseDate).toLocaleDateString() : '-'}</p></div><div className="rounded-lg bg-white p-5 border"><h3 className="font-semibold">Feedback</h3>{feedback ? <><p className="mt-2">{feedback.mentorComments}</p><p className="text-sm">Rating: {feedback.rating || '-'} / 5</p></> : <p className="mt-2 text-sm text-slate-500">No completed feedback yet.</p>}</div></section></div></AppShell>;
};
export default MentorReview;
