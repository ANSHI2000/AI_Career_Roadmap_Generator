import express from 'express';
import { getGoals, getRoles, recommendGoal, saveGoals } from '../controllers/careerController.js';

const router = express.Router();

router.get('/goals', getGoals);
router.post('/goals', saveGoals);
router.get('/roles', getRoles);
router.post('/goals/recommend', recommendGoal);

export default router;
