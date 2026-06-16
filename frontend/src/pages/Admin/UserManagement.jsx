import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { SearchBar } from '../../components/common/SearchBar.jsx';
import { authService } from '../../services/authService.js';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');

  const loadUsers = async () => {
    const response = await authService.listApprovalRequests();
    setUsers(response.data || []);
  };

  useEffect(() => {
    loadUsers().catch(() => toast.error('Could not load approval requests'));
  }, []);

  const handleSearch = (query) => {
    setQuery(query);
  };

  const approve = async (userId) => {
    await authService.approveUser(userId);
    toast.success('User approved');
    loadUsers();
  };

  const reject = async (userId) => {
    const reason = window.prompt('Reason for rejection?') || '';
    await authService.rejectUser(userId, reason);
    toast.success('User rejected');
    loadUsers();
  };

  const filteredUsers = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Manage all platform users and their roles.</p>
        </div>

        <Card title="Search Users" description="Find and manage users">
          <SearchBar onSearch={handleSearch} />
        </Card>

        <Card title="Pending Approvals" description="Mentor, placement officer, and admin accounts awaiting verification">
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
                  <p className="text-xs text-slate-500">Status: {user.verificationStatus}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="info">{user.role}</Badge>
                  <Button size="sm" onClick={() => approve(user.id)}>Approve</Button>
                  <Button variant="secondary" size="sm" onClick={() => reject(user.id)}>Reject</Button>
                </div>
              </div>
            ))}
            {!filteredUsers.length && <p className="text-sm text-slate-500">No pending approvals.</p>}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
