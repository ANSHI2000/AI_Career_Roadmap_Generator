import express from 'express';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/profileController.js';
import { upload } from '../utils/fileUpload.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

export default router;
