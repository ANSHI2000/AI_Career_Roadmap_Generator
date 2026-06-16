import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import toast from 'react-hot-toast';

export default function CareerRoleCatalog() {
  const [roles, setRoles] = useState([
    { id: 1, title: 'Full Stack Developer', requiredSkills: 8, level: 'Intermediate' },
    { id: 2, title: 'Frontend Developer', requiredSkills: 6, level: 'Intermediate' },
    { id: 3, title: 'Backend Developer', requiredSkills: 7, level: 'Intermediate' },
  ]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setRoles([...roles, { id: Date.now(), ...data, requiredSkills: 5 }]);
      reset();
      toast.success('Career role added!');
    } catch (error) {
      toast.error('Failed to add role');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Career Role Catalog</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Manage target career roles and skill requirements.</p>
        </div>

        <Card title="Add New Role" description="Create a new career role profile">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Role Title" placeholder="e.g., DevOps Engineer" {...register('title', { required: true })} />
            <Input label="Industry" placeholder="e.g., Technology, Finance" {...register('industry')} />
            <Textarea label="Description" placeholder="Role description and responsibilities..." {...register('description')} />
            <Button type="submit" disabled={isSubmitting}>Add Role</Button>
          </form>
        </Card>

        <Card title="Catalog" description="All available career roles">
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{role.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Required Skills: {role.requiredSkills}</p>
                </div>
                <Badge variant="info">{role.level}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
