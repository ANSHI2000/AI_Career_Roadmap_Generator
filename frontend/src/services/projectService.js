import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const projectService = {
  getProjects: (params) => api.get(ENDPOINTS.PROJECTS, { params }).then((res) => res.data),
  createProject: (payload) => api.post(ENDPOINTS.PROJECTS, payload).then((res) => res.data),
  updateProject: (projectId, payload) => api.put(`${ENDPOINTS.PROJECTS}/${projectId}`, payload).then((res) => res.data),
  deleteProject: (projectId) => api.delete(`${ENDPOINTS.PROJECTS}/${projectId}`).then((res) => res.data),
  uploadScreenshots: (projectId, formData) => api.post(`${ENDPOINTS.PROJECTS}/${projectId}/screenshots`, formData).then((res) => res.data),
};
