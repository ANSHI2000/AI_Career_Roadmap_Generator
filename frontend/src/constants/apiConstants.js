export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_REFRESH: '/auth/refresh',
  PROFILE: '/profile',
  GOALS: '/career/goals',
  CAREER_ROLES: '/career/roles',
  SKILL_REQUIREMENTS: '/career/requirements',
  SKILLS: '/skills',
  ROADMAP: '/roadmap',
  GAP_ANALYSIS: '/gap-analysis',
  RECOMMENDATIONS: '/recommendations',
  PROJECTS: '/projects',
  MENTOR_STUDENTS: '/mentor/students',
  REVIEWS: '/mentor/reviews',
  NOTIFICATIONS: '/notifications',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
};
