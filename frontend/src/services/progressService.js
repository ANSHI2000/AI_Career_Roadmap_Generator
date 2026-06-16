import api from './axiosConfig.js';

export const progressService = {
  overview: () => api.get('/progress/overview').then((res) => res.data),
  roadmap: () => api.get('/progress/roadmap').then((res) => res.data),
  tasks: () => api.get('/progress/tasks').then((res) => res.data),
  completeTask: (taskId, payload) => api.put(`/progress/task/${taskId}/complete`, payload).then((res) => res.data),
  uploadEvidence: (taskId, formData) => api.post(`/progress/task/${taskId}/evidence`, formData).then((res) => res.data),
  analytics: () => api.get('/progress/analytics').then((res) => res.data),
  logTime: (taskId, payload) => api.post(`/progress/task/${taskId}/log-time`, payload).then((res) => res.data),
};
