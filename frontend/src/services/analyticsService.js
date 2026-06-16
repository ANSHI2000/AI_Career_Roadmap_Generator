import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const analyticsService = {
  getDashboardStats: () => api.get(ENDPOINTS.ANALYTICS).then((res) => res.data),
  getReports: () => api.get(ENDPOINTS.REPORTS).then((res) => res.data),
};
