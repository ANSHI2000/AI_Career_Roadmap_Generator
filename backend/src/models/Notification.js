import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'Roadmap Generated',
        'Mentor Assigned',
        'Feedback Received',
        'Milestone Reminder',
        'Skill Gap Alert',
        'Certificate Ready',
        'System',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
