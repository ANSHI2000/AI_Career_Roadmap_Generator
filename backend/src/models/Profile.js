import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    currentEducation: {
      type: String,
      enum: ['High School', 'Bachelor\'s', 'Master\'s', 'PhD', ''],
      default: '',
    },
    yearOfStudy: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th', 'Graduated', ''],
      default: '',
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      default: '',
    },
    currentRole: {
      type: String,
      trim: true,
      default: '',
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 50,
      default: 0,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Calculate profile completion percentage
profileSchema.methods.calculateCompletion = function () {
  const fields = [
    'fullName',
    'currentEducation',
    'yearOfStudy',
    'fieldOfStudy',
    'currentRole',
    'location',
    'bio',
    'linkedinUrl',
    'githubUrl',
    'portfolioUrl',
    'profilePicture',
  ];
  
  let filledFields = 0;
  fields.forEach(field => {
    if (this[field] && this[field] !== '') {
      filledFields++;
    }
  });
  
  this.profileCompletion = Math.round((filledFields / fields.length) * 100);
  return this.profileCompletion;
};

export default mongoose.model('Profile', profileSchema);
