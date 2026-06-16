import mongoose from 'mongoose';

const careerGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    targetRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CareerRole',
    },
    targetIndustry: {
      type: [String],
      default: [],
    },
    targetCompanyTypes: {
      type: [String],
      enum: ['Startup', 'Mid-size', 'Large Corp', 'FAANG', 'Remote'],
      default: [],
    },
    desiredSalaryRange: {
      min: {
        type: Number,
        default: 3,
      },
      max: {
        type: Number,
        default: 50,
      },
    },
    targetTimeline: {
      type: String,
      enum: ['3 months', '6 months', '1 year', '2 years'],
      default: '6 months',
    },
    preferredLearningStyle: {
      type: String,
      enum: ['Self-paced', 'Structured course', 'Bootcamp'],
      default: 'Self-paced',
    },
    weeklyTimeCommitment: {
      type: Number,
      enum: [5, 10, 20, 30],
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CareerGoal', careerGoalSchema);
