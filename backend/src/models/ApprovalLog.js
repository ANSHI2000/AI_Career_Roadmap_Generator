import mongoose from 'mongoose';

const approvalLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['approved', 'rejected'],
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

approvalLogSchema.index({ adminId: 1, timestamp: -1 });
approvalLogSchema.index({ targetUser: 1, timestamp: -1 });

export default mongoose.model('ApprovalLog', approvalLogSchema);
