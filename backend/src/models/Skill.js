import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillName: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Soft Skill', 'Language', 'Tool'],
      required: true,
    },
    proficiencyLevel: {
      type: Number,
      min: 1,
      max: 4,
      required: true,
      // 1: Beginner, 2: Intermediate, 3: Advanced, 4: Expert
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    evidence: {
      type: {
        type: String,
        enum: ['Certificate', 'Project', 'Work Experience', 'Course', 'None'],
        default: 'None',
      },
      link: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      fileUrl: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

// Index for faster queries
skillSchema.index({ userId: 1, skillName: 1 });
skillSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Skill', skillSchema);
