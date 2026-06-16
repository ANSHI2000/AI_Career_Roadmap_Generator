import MentorReview from '../models/MentorReview.js';
import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { logActivity } from '../utils/activityLogger.js';
import { createNotification } from '../utils/notificationHelper.js';

export const requestReview = async (req, res) => {
  const roadmap = await Roadmap.findOne({ _id: req.body.roadmapId, userId: req.userId });
  if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
  const expected = new Date();
  expected.setDate(expected.getDate() + 5);
  const review = await MentorReview.create({ userId: req.userId, roadmapId: roadmap._id, studentNotes: req.body.notes || '', expectedResponseDate: expected });
  await logActivity(req.userId, 'Mentor Review Requested', `Submitted ${roadmap.title} for review`, '/mentor-review');
  await createNotification(req.userId, 'Mentor Assigned', 'Review requested', 'Your roadmap is waiting for mentor review.', '/mentor-review');
  res.status(201).json({ success: true, data: review, message: 'Review requested' });
};

export const getReviewStatus = async (req, res) => {
  const review = await MentorReview.findOne({ userId: req.userId }).sort({ createdAt: -1 }).populate('roadmapId');
  res.json({ success: true, data: review });
};

export const getFeedback = async (req, res) => {
  const review = await MentorReview.findOne({ userId: req.userId, status: 'Completed' }).sort({ updatedAt: -1 });
  res.json({ success: true, data: review });
};

export const resubmitReview = async (req, res) => {
  const review = await MentorReview.findOne({ userId: req.userId }).sort({ createdAt: -1 });
  if (!review) return res.status(404).json({ success: false, message: 'Review request not found' });
  review.previousFeedback.push({ comments: review.mentorComments, suggestions: review.suggestions, date: new Date() });
  review.studentNotes = req.body.changes || review.studentNotes;
  review.status = 'Resubmitted';
  review.resubmissionCount += 1;
  await review.save();
  res.json({ success: true, data: review, message: 'Review resubmitted' });
};

export const listStudentReviews = async (req, res) => {
  const reviews = await MentorReview.find({ status: { $in: ['Pending', 'In Review', 'Resubmitted'] } })
    .sort({ createdAt: 1 })
    .populate('userId', 'name email studentProfile')
    .populate('roadmapId', 'title targetRole completionPercentage readinessScore');

  res.json({ success: true, data: reviews });
};

export const addReviewComment = async (req, res) => {
  const review = await MentorReview.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  const mentor = await User.findById(req.userId);
  if (!mentor || mentor.role !== 'mentor') {
    return res.status(403).json({ success: false, message: 'Only mentors can review students' });
  }

  review.mentorId = mentor._id;
  review.status = req.body.status || 'Completed';
  review.mentorComments = req.body.comments || review.mentorComments;
  review.suggestions = Array.isArray(req.body.suggestions) ? req.body.suggestions : String(req.body.suggestions || '').split(',').map((item) => item.trim()).filter(Boolean);
  review.actionItems = Array.isArray(req.body.actionItems) ? req.body.actionItems : String(req.body.actionItems || '').split(',').map((item) => item.trim()).filter(Boolean);
  review.rating = req.body.rating || review.rating;
  review.reviewDate = new Date();
  await review.save();

  await createNotification(review.userId, 'Mentor Feedback', 'Review completed', `${mentor.name} reviewed your roadmap.`, '/mentor-review');
  res.json({ success: true, data: review, message: 'Review saved' });
};
