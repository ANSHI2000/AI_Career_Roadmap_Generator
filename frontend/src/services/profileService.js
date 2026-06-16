import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const profileService = {
  get: () => api.get(ENDPOINTS.PROFILE).then((res) => res.data),
  update: (profile) => api.put(ENDPOINTS.PROFILE, profile).then((res) => res.data),
  uploadAvatar: (formData) => api.post(`${ENDPOINTS.PROFILE}/avatar`, formData).then((res) => res.data),
};
