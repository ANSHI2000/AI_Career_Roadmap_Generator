import express from 'express';
import { completeTask, getActiveRoadmapProgress, getAnalytics, getOverview, getTasks, logTime, uploadTaskEvidence } from '../controllers/progressController.js';
import { upload } from '../utils/fileUpload.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/roadmap', getActiveRoadmapProgress);
router.get('/tasks', getTasks);
router.put('/task/:taskId/complete', completeTask);
router.post('/task/:taskId/evidence', upload.single('evidence'), uploadTaskEvidence);
router.get('/analytics', getAnalytics);
router.post('/task/:taskId/log-time', logTime);

export default router;
