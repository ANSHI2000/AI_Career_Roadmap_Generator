import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { notificationService } from '../../services/notificationService.js';

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState([]);
  const load = () => notificationService.getNotifications({ filter }).then((res) => setItems(res.data.items));
  useEffect(() => { load(); }, [filter]);
  const read = async (item) => { await notificationService.markAsRead(item._id); if (item.link) navigate(item.link); load(); };
  const readAll = async () => { await notificationService.markAllRead(); toast.success('All read'); load(); };
  const remove = async (id) => { await notificationService.deleteNotification(id); load(); };
  return <AppShell title="Notifications"><section className="rounded-lg bg-white p-5 border"><div className="flex flex-wrap justify-between gap-3"><select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded border p-2"><option>All</option><option>Unread</option><option>System</option><option>Roadmap Generated</option><option>Mentor Assigned</option><option>Feedback Received</option><option>Milestone Reminder</option><option>Skill Gap Alert</option><option>Certificate Ready</option></select><button onClick={readAll} className="rounded border px-3 py-2 text-sm">Mark all read</button></div><div className="mt-4 space-y-2">{items.map((item) => <div key={item._id} className={`flex items-center justify-between rounded-lg p-3 ${item.isRead ? 'bg-slate-50' : 'bg-indigo-50'}`}><button onClick={() => read(item)} className="text-left"><p className="font-medium">{item.title}</p><p className="text-sm text-slate-600">{item.message}</p></button><button onClick={() => remove(item._id)} className="text-sm text-red-600">Delete</button></div>)}</div></section></AppShell>;
};
export default Notifications;
