import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConstants.js';
import { clearAuthData, getToken } from '../utils/tokenStorage.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
