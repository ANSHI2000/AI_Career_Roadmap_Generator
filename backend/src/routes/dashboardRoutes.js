import express from 'express';
import { getDashboardStats, getNextAction, getPlacementAnalytics, getRecentActivity } from '../controllers/dashboardController.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/next-action', getNextAction);
router.get('/placement/analytics', authorize(['placement_officer', 'admin']), getPlacementAnalytics);

export default router;
