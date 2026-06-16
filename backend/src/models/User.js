import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false, // Don't return OTP by default
    },
    otpExpiresAt: {
      type: Date,
      select: false, // Don't return OTP expiry by default
    },
    role: {
      type: String,
      enum: ['student', 'mentor', 'placement_officer', 'public', 'admin'],
      default: 'student',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    approvalRequestDate: {
      type: Date,
      default: Date.now,
    },
    studentProfile: {
      college: { type: String, default: '' },
      degree: { type: String, default: '' },
      branch: { type: String, default: '' },
      currentYear: { type: String, default: '' },
      skills: { type: [String], default: [] },
      targetRole: { type: String, default: '' },
    },
    mentorProfile: {
      expertise: { type: [String], default: [] },
      experienceYears: { type: Number, default: 0 },
      linkedin: { type: String, default: '' },
      bio: { type: String, default: '' },
    },
    placementOfficerProfile: {
      institution: { type: String, default: '' },
      department: { type: String, default: '' },
      designation: { type: String, default: '' },
    },
    publicProfile: {
      interests: { type: [String], default: [] },
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
