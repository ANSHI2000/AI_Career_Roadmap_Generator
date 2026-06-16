import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
