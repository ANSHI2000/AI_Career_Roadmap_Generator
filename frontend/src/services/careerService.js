import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const careerService = {
  getGoals: () => api.get(ENDPOINTS.GOALS).then((res) => res.data),
  saveGoals: (payload) => api.post(ENDPOINTS.GOALS, payload).then((res) => res.data),
  getCareerRoles: () => api.get(ENDPOINTS.CAREER_ROLES).then((res) => res.data),
  recommend: (payload) => api.post(`${ENDPOINTS.GOALS}/recommend`, payload).then((res) => res.data),
};
