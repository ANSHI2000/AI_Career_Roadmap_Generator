import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { ROUTES } from '../../constants/routeConstants.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Footer } from '../../components/layout/Footer.jsx';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Logged in successfully!');
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
        <Card className="w-full max-w-md" title="Sign In" description="Welcome back! Sign in to your account.">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="Enter your password"
              icon={<Lock className="h-5 w-5" />}
              error={errors.password?.message}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account? <Link to={ROUTES.REGISTER} className="font-semibold text-brand-600 hover:text-brand-700">Sign up</Link>
          </p>
        </Card>
      </main>

      <Footer />
    </>
  );
}
