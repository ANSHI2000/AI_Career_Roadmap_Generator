import express from 'express';
import { createSkill, deleteSkill, getSkills, updateSkill, uploadEvidence } from '../controllers/skillController.js';
import { upload } from '../utils/fileUpload.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);
router.post('/evidence', upload.single('evidence'), uploadEvidence);

export default router;
