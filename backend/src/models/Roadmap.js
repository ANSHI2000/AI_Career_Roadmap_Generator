import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  estimatedHours: {
    type: Number,
    default: 0,
  },
  actualHours: {
    type: Number,
    default: 0,
  },
});

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  tasks: [taskSchema],
  resources: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['Course', 'Article', 'Video', 'Book', 'Documentation', 'Other'],
        default: 'Article',
      },
    },
  ],
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  estimatedHours: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
  },
});

const phaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  milestones: [milestoneSchema],
  order: {
    type: Number,
    required: true,
  },
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: '',
    },
    timeline: {
      type: String,
      enum: ['3 months', '6 months', '12 months', '24 months'],
      required: true,
    },
    timeframe: {
      type: String,
      default: '',
    },
    learningIntensity: {
      type: String,
      enum: ['Casual', 'Moderate', 'Intense'],
      default: 'Moderate',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    phases: [phaseSchema],
    skillGapAnalysis: {
      type: [String],
      default: [],
    },
    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    monthlyMilestones: {
      type: [String],
      default: [],
    },
    projectsToBuild: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    resumeSuggestions: {
      type: [String],
      default: [],
    },
    jobStrategy: {
      type: [String],
      default: [],
    },
    finalOutcome: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Calculate completion percentage
roadmapSchema.methods.calculateCompletion = function () {
  let totalTasks = 0;
  let completedTasks = 0;

  this.phases.forEach(phase => {
    phase.milestones.forEach(milestone => {
      milestone.tasks.forEach(task => {
        totalTasks++;
        if (task.isCompleted) {
          completedTasks++;
        }
      });
    });
  });

  this.completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return this.completionPercentage;
};

export default mongoose.model('Roadmap', roadmapSchema);
