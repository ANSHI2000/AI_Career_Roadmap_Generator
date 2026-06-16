import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { RadioGroup } from '../../components/ui/RadioGroup.jsx';
import { ROUTES } from '../../constants/routeConstants.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { USER_ROLES } from '../../constants/roleConstants.js';
import { Footer } from '../../components/layout/Footer.jsx';
import { Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const role = watch('role', USER_ROLES.STUDENT);

  const onSubmit = async (data) => {
    try {
      await authRegister({ name: data.name, email: data.email, password: data.password, role: data.role });
      toast.success('Account created successfully!');
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-brand-700 dark:text-brand-300">ACRG</Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md" title="Create Account" description="Join our community and start your career journey.">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={<User className="h-5 w-5" />}
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              icon={<Lock className="h-5 w-5" />}
              error={errors.password?.message}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <RadioGroup
              label="Role"
              name="role"
              value={role}
              onChange={(val) => register('role').onChange({ target: { value: val } })}
              options={[
                { value: USER_ROLES.STUDENT, label: 'Student' },
                { value: USER_ROLES.MENTOR, label: 'Mentor' },
                { value: USER_ROLES.PLACEMENT_OFFICER, label: 'Placement Officer' },
                { value: USER_ROLES.ADMIN, label: 'Admin' },
              ]}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account? <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
        </Card>
      </main>

      <Footer />
    </>
  );
}
