import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const mentorService = {
  requestReview: (payload) => api.post('/mentor/request-review', payload).then((res) => res.data),
  getReviewStatus: () => api.get('/mentor/review-status').then((res) => res.data),
  getFeedback: () => api.get('/mentor/feedback').then((res) => res.data),
  resubmit: (payload) => api.post('/mentor/resubmit', payload).then((res) => res.data),
  listStudents: () => api.get('/mentor/students').then((res) => res.data),
  addComment: (reviewId, payload) => api.patch(`/mentor/reviews/${reviewId}/comment`, payload).then((res) => res.data),
};
