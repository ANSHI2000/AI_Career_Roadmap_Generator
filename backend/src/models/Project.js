import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillsUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    technologies: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
    screenshots: {
      type: [String],
      default: [],
    },
    thumbnailImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed'],
      default: 'Planning',
    },
    startDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    reflection: {
      type: String,
      default: '',
    },
    linkedRoadmapMilestone: {
      roadmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap',
      },
      milestoneId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ userId: 1, title: 'text' });

export default mongoose.model('Project', projectSchema);
