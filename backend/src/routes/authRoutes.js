import express from 'express';
import {
  register,
  verifyRegisterOtp,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  listApprovalRequests,
  approveUser,
  rejectUser,
} from '../controllers/authController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.get('/approvals/pending', authMiddleware, authorize(['admin']), listApprovalRequests);
router.patch('/approvals/:userId/approve', authMiddleware, authorize(['admin']), approveUser);
router.patch('/approvals/:userId/reject', authMiddleware, authorize(['admin']), rejectUser);

export default router;
