import express from 'express';
import { analyzeRole, getGapAnalysis, getRecommendations } from '../controllers/gapAnalysisController.js';

const router = express.Router();

router.get('/', getGapAnalysis);
router.get('/recommendations', getRecommendations);
router.get('/role/:roleId', analyzeRole);

export default router;
