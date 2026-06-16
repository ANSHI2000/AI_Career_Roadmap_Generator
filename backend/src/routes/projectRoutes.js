import express from 'express';
import { createProject, deleteProject, getProject, listProjects, updateProject, uploadScreenshots } from '../controllers/projectController.js';
import { upload } from '../utils/fileUpload.js';

const router = express.Router();

router.get('/', listProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/screenshots', upload.array('screenshots', 6), uploadScreenshots);

export default router;
