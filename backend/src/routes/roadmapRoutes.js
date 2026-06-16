import express from 'express';
import { deleteRoadmap, exportRoadmap, generateRoadmap, getRoadmap, listRoadmaps, saveRoadmap, setActiveRoadmap, updateRoadmap } from '../controllers/roadmapController.js';

const router = express.Router();

router.post('/generate', generateRoadmap);
router.get('/', listRoadmaps);
router.get('/:id', getRoadmap);
router.post('/', saveRoadmap);
router.put('/:id', updateRoadmap);
router.delete('/:id', deleteRoadmap);
router.put('/:id/active', setActiveRoadmap);
router.post('/:id/export', exportRoadmap);

export default router;
