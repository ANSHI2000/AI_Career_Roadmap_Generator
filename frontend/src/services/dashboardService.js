import api from './axiosConfig.js';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then((res) => res.data),
  getRecentActivity: () => api.get('/dashboard/recent-activity').then((res) => res.data),
  getNextAction: () => api.get('/dashboard/next-action').then((res) => res.data),
  getPlacementAnalytics: () => api.get('/dashboard/placement/analytics').then((res) => res.data),
};
