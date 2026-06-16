import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await forgotPassword(data.email);

      if (result.success) {
        toast.success(result.message || 'Reset OTP sent to your email');
        navigate('/reset-password', { state: { email: data.email } });
      } else {
        toast.error(result.message || 'Could not send reset OTP');
      }
    } catch (error) {
      toast.error('An error occurred while sending reset OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your email to receive a password reset OTP.</p>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
