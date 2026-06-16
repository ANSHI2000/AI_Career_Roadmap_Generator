import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { Select } from '../../components/ui/Select.jsx';
import toast from 'react-hot-toast';

export default function ContentManagement() {
  const [resources, setResources] = useState([
    { id: 1, title: 'JavaScript Fundamentals', type: 'Course', status: 'Published' },
    { id: 2, title: 'React Best Practices', type: 'Tutorial', status: 'Draft' },
  ]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setResources([...resources, { id: Date.now(), ...data }]);
      reset();
      toast.success('Resource added!');
    } catch (error) {
      toast.error('Failed to add resource');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Content Management</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Manage learning resources and recommendations.</p>
        </div>

        <Card title="Add Learning Resource" description="Create course or tutorial content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Title" placeholder="Resource title" {...register('title', { required: true })} />
            <Select
              label="Type"
              options={[
                { value: 'course', label: 'Course' },
                { value: 'tutorial', label: 'Tutorial' },
                { value: 'book', label: 'Book' },
                { value: 'project', label: 'Project' },
              ]}
              {...register('type')}
            />
            <Input label="URL" placeholder="https://example.com/resource" {...register('url')} />
            <Textarea label="Description" placeholder="Resource description..." {...register('description')} />
            <Button type="submit" disabled={isSubmitting}>Add Resource</Button>
          </form>
        </Card>

        <Card title="Content Library" description="Managed learning resources">
          <div className="space-y-3">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{resource.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{resource.type}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  resource.status === 'Published'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                }`}>
                  {resource.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
