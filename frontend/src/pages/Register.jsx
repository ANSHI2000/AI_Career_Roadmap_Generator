import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { USER_ROLES } from '../constants/roleConstants.js';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: USER_ROLES.STUDENT },
  });

  const password = watch('password');
  const role = watch('role');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await registerUser(data);

      if (result.success) {
        toast.success(result.message || 'Registration successful! Check your email for OTP.');
        navigate('/verify-register-otp', { state: { email: data.email } });
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join AI Career Roadmap and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value={USER_ROLES.STUDENT}>Student</option>
              <option value={USER_ROLES.MENTOR}>Mentor</option>
              <option value={USER_ROLES.PLACEMENT_OFFICER}>Placement Officer</option>
              <option value={USER_ROLES.PUBLIC}>Public Learner</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {role === USER_ROLES.STUDENT && (
            <div className="grid gap-4 sm:grid-cols-2">
              <input {...register('college')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="College" />
              <input {...register('degree')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Degree" />
              <input {...register('branch')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Branch" />
              <select {...register('currentYear')} className="rounded-lg border border-gray-300 px-4 py-2">
                <option value="">Current year</option>
                <option value="1st">1st year</option>
                <option value="2nd">2nd year</option>
                <option value="3rd">3rd year</option>
                <option value="4th">4th year</option>
              </select>
              <input {...register('skills')} className="rounded-lg border border-gray-300 px-4 py-2 sm:col-span-2" placeholder="Skills, comma separated" />
              <input {...register('targetRole')} className="rounded-lg border border-gray-300 px-4 py-2 sm:col-span-2" placeholder="Target role" />
            </div>
          )}

          {role === USER_ROLES.MENTOR && (
            <div className="grid gap-4">
              <input {...register('expertise')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Expertise, comma separated" />
              <input {...register('experienceYears')} type="number" min="0" className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Years of experience" />
              <input {...register('linkedin')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="LinkedIn URL" />
              <textarea {...register('bio')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Short mentor bio" />
            </div>
          )}

          {role === USER_ROLES.PLACEMENT_OFFICER && (
            <div className="grid gap-4">
              <input {...register('institution')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Institution" />
              <input {...register('department')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Department" />
              <input {...register('designation')} className="rounded-lg border border-gray-300 px-4 py-2" placeholder="Designation" />
            </div>
          )}

          {role === USER_ROLES.PUBLIC && (
            <input {...register('interests')} className="w-full rounded-lg border border-gray-300 px-4 py-2" placeholder="Interests, comma separated" />
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
