import api from './api.js';

export const authService = {
  register: async (payloadOrName, email, password, confirmPassword) => {
    const payload = typeof payloadOrName === 'object'
      ? { ...payloadOrName, confirmPassword: payloadOrName.confirmPassword || payloadOrName.password }
      : { name: payloadOrName, email, password, confirmPassword };
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  // Verify Register OTP - Step 2: User verifies email with OTP
  verifyRegisterOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-register-otp', {
      email,
      otp,
    });
    return response.data;
  },

  // Login - Step 1: User provides email and password
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  resetPassword: async (email, otp, password, confirmPassword) => {
    const response = await api.post('/auth/reset-password', {
      email,
      otp,
      password,
      confirmPassword,
    });
    return response.data;
  },

  // Get Profile - Protected route to get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  listApprovalRequests: async () => {
    const response = await api.get('/auth/approvals/pending');
    return response.data;
  },

  approveUser: async (userId) => {
    const response = await api.patch(`/auth/approvals/${userId}/approve`);
    return response.data;
  },

  rejectUser: async (userId, reason) => {
    const response = await api.patch(`/auth/approvals/${userId}/reject`, { reason });
    return response.data;
  },
};
