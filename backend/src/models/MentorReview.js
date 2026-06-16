import mongoose from 'mongoose';

const mentorReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentNotes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Completed', 'Resubmitted'],
      default: 'Pending',
    },
    mentorComments: { type: String, default: '' },
    suggestions: { type: [String], default: [] },
    rating: { type: Number, min: 1, max: 5 },
    actionItems: { type: [String], default: [] },
    requestDate: { type: Date, default: Date.now },
    reviewDate: { type: Date },
    expectedResponseDate: { type: Date },
    resubmissionCount: { type: Number, default: 0 },
    previousFeedback: [
      {
        comments: String,
        suggestions: [String],
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

mentorReviewSchema.index({ userId: 1, status: 1 });
mentorReviewSchema.index({ mentorId: 1, status: 1 });

export default mongoose.model('MentorReview', mentorReviewSchema);
