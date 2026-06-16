import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardLayout } from '../../components/layout/DashboardLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { RadioGroup } from '../../components/ui/RadioGroup.jsx';
import toast from 'react-hot-toast';

export default function Review() {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();
  const rating = watch('rating', '4');

  const onSubmit = async (data) => {
    try {
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Provide Student Review</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Give feedback and guidance to your mentee.</p>
        </div>

        <Card title="Review Form" description="Share your assessment">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              label="Feedback"
              placeholder="Provide constructive feedback on the student's progress, strengths, and areas for improvement..."
              {...register('feedback', { required: 'Feedback is required' })}
            />

            <RadioGroup
              label="Rating"
              name="rating"
              value={rating}
              onChange={(val) => register('rating').onChange({ target: { value: val } })}
              options={[
                { value: '5', label: '★★★★★ - Excellent Progress' },
                { value: '4', label: '★★★★☆ - Good Progress' },
                { value: '3', label: '★★★☆☆ - Satisfactory' },
                { value: '2', label: '★★☆☆☆ - Needs Improvement' },
              ]}
            />

            <Textarea
              label="Recommendations"
              placeholder="What should the student focus on next?"
              {...register('recommendations')}
            />

            <Button type="submit" disabled={isSubmitting}>Submit Review</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
