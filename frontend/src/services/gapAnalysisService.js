import api from './axiosConfig.js';
import { ENDPOINTS } from '../constants/apiConstants.js';

export const gapAnalysisService = {
  getGapAnalysis: () => api.get(ENDPOINTS.GAP_ANALYSIS).then((res) => res.data),
  getRecommendations: () => api.get(`${ENDPOINTS.GAP_ANALYSIS}/recommendations`).then((res) => res.data),
  analyzeRole: (roleId) => api.get(`${ENDPOINTS.GAP_ANALYSIS}/role/${roleId}`).then((res) => res.data),
};
