import express from 'express';
import { addReviewComment, getFeedback, getReviewStatus, listStudentReviews, requestReview, resubmitReview } from '../controllers/mentorController.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request-review', requestReview);
router.get('/review-status', getReviewStatus);
router.get('/feedback', getFeedback);
router.post('/resubmit', resubmitReview);
router.get('/students', authorize(['mentor']), listStudentReviews);
router.patch('/reviews/:reviewId/comment', authorize(['mentor']), addReviewComment);

export default router;
