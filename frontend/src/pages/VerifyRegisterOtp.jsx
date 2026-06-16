import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardPathForRole } from '../utils/roleRouting.js';

const VerifyRegisterOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyRegisterOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const email = location.state?.email || '';

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Email not found. Please register again.</p>
          <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-500">
            Back to Register
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await verifyRegisterOtp(email, data.otp);

      if (result.success) {
        toast.success(result.message || 'Email verified');
        const user = JSON.parse(localStorage.getItem('authUser') || '{}');
        if (user.isVerified) {
          navigate(getDashboardPathForRole(user.role));
        } else {
          navigate('/login');
        }
      } else {
        toast.error(result.message || 'OTP verification failed');
      }
    } catch (error) {
      toast.error('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the OTP sent to
          </p>
          <p className="text-sm font-medium text-gray-900">{email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* OTP Field */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
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
              className="w-full px-4 py-2 text-center text-2xl letter-spacing tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="000000"
            />
            {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>}
            <p className="mt-2 text-xs text-gray-500">
              OTP is valid for 10 minutes
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive OTP?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegisterOtp;
