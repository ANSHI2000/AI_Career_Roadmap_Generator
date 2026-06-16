import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: location.state?.email || '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await resetPassword(data.email, data.otp, data.password, data.confirmPassword);

      if (result.success) {
        toast.success(result.message || 'Password reset successful');
        navigate('/login');
      } else {
        toast.error(result.message || 'Password reset failed');
      }
    } catch (error) {
      toast.error('An error occurred while resetting your password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter the OTP from your email and choose a new password.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email',
                },
              })}
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              {...register('otp', {
                required: 'OTP is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'OTP must be 6 digits',
                },
              })}
              type="text"
              maxLength="6"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-2xl tracking-widest focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              placeholder="000000"
            />
            {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter new password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Request a new OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
