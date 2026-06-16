import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const notificationService = {
  getNotifications: (params) => api.get(ENDPOINTS.NOTIFICATIONS, { params }).then((res) => res.data),
  unreadCount: () => api.get(`${ENDPOINTS.NOTIFICATIONS}/unread-count`).then((res) => res.data),
  markAsRead: (notificationId) => api.put(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`).then((res) => res.data),
  markAllRead: () => api.put(`${ENDPOINTS.NOTIFICATIONS}/read-all`).then((res) => res.data),
  deleteNotification: (notificationId) => api.delete(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}`).then((res) => res.data),
};
