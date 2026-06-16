import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setUser, getToken, setToken, clearAuthData } from '../utils/tokenStorage.js';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const register = async (nameOrPayload, email, password, confirmPassword) => {
    try {
      const response = await authService.register(nameOrPayload, email, password, confirmPassword);
      return {
        success: true,
        message: response.message,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const verifyRegisterOtp = async (email, otp) => {
    try {
      const response = await authService.verifyRegisterOtp(email, otp);
      const { token: newToken, user: userData } = response.data;

      setUserState(userData);
      setUser(userData);
      if (newToken) {
        setTokenState(newToken);
        setToken(newToken);
        setIsAuthenticated(true);
      } else {
        setTokenState(null);
        setIsAuthenticated(false);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response.data;

      setTokenState(newToken);
      setUserState(userData);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not send reset OTP',
      };
    }
  };

  const resetPassword = async (email, otp, password, confirmPassword) => {
    try {
      const response = await authService.resetPassword(email, otp, password, confirmPassword);

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
      };
    }
  };

  const logout = () => {
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);
    clearAuthData();
  };

  const value = {
    auth: {
      token,
      user,
    },
    user,
    token,
    loading,
    isAuthenticated,
    register,
    verifyRegisterOtp,
    login,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
