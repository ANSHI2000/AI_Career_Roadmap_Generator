import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const skillService = {
  getSkills: (params) => api.get(ENDPOINTS.SKILLS, { params }).then((res) => res.data),
  addSkill: (payload) => api.post(ENDPOINTS.SKILLS, payload).then((res) => res.data),
  updateSkill: (skillId, payload) => api.put(`${ENDPOINTS.SKILLS}/${skillId}`, payload).then((res) => res.data),
  deleteSkill: (skillId) => api.delete(`${ENDPOINTS.SKILLS}/${skillId}`).then((res) => res.data),
  uploadEvidence: (formData) => api.post(`${ENDPOINTS.SKILLS}/evidence`, formData).then((res) => res.data),
};
