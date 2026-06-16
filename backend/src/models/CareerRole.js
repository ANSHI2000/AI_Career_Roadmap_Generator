import mongoose from 'mongoose';

const careerRoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    requiredSkills: [
      {
        skillName: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          enum: ['Technical', 'Soft Skill', 'Language', 'Tool'],
          required: true,
        },
        minimumProficiency: {
          type: Number,
          min: 1,
          max: 4,
          default: 2,
        },
        priority: {
          type: String,
          enum: ['Must Have', 'Good to Have', 'Optional'],
          default: 'Must Have',
        },
      },
    ],
    averageSalary: {
      min: Number,
      max: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CareerRole', careerRoleSchema);
