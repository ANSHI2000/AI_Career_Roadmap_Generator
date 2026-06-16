import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const roadmapService = {
  generateRoadmap: (payload) => api.post(`${ENDPOINTS.ROADMAP}/generate`, payload).then((res) => res.data),
  list: () => api.get(ENDPOINTS.ROADMAP).then((res) => res.data),
  getRoadmap: (id) => api.get(id ? `${ENDPOINTS.ROADMAP}/${id}` : ENDPOINTS.ROADMAP).then((res) => res.data),
  create: (payload) => api.post(ENDPOINTS.ROADMAP, payload).then((res) => res.data),
  update: (id, payload) => api.put(`${ENDPOINTS.ROADMAP}/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`${ENDPOINTS.ROADMAP}/${id}`).then((res) => res.data),
  setActive: (id) => api.put(`${ENDPOINTS.ROADMAP}/${id}/active`).then((res) => res.data),
  exportPdf: (id) => api.post(`${ENDPOINTS.ROADMAP}/${id}/export`, {}, { responseType: 'blob' }).then((res) => res.data),
};
