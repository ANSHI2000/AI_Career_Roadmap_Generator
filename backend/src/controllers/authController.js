import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import ApprovalLog from '../models/ApprovalLog.js';
import { generateToken } from '../utils/generateToken.js';
import { sendStatusEmail } from '../utils/sendEmail.js';
import { sendOTP, verifyOTP } from '../services/authService.js';

const ROLE_VALUES = ['student', 'mentor', 'placement_officer', 'public', 'admin'];
const ADMIN_APPROVAL_ROLES = ['mentor', 'placement_officer', 'admin'];

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const pickRoleProfile = (role, body) => {
  if (role === 'student') {
    return {
      studentProfile: {
        college: body.college || body.studentProfile?.college || '',
        degree: body.degree || body.studentProfile?.degree || '',
        branch: body.branch || body.studentProfile?.branch || '',
        currentYear: body.currentYear || body.studentProfile?.currentYear || '',
        skills: normalizeList(body.skills || body.studentProfile?.skills),
        targetRole: body.targetRole || body.studentProfile?.targetRole || '',
      },
    };
  }

  if (role === 'mentor') {
    return {
      mentorProfile: {
        expertise: normalizeList(body.expertise || body.mentorProfile?.expertise),
        experienceYears: Number(body.experienceYears || body.mentorProfile?.experienceYears || 0),
        linkedin: body.linkedin || body.mentorProfile?.linkedin || '',
        bio: body.bio || body.mentorProfile?.bio || '',
      },
    };
  }

  if (role === 'placement_officer') {
    return {
      placementOfficerProfile: {
        institution: body.institution || body.placementOfficerProfile?.institution || '',
        department: body.department || body.placementOfficerProfile?.department || '',
        designation: body.designation || body.placementOfficerProfile?.designation || '',
      },
    };
  }

  if (role === 'public') {
    return {
      publicProfile: {
        interests: normalizeList(body.interests || body.publicProfile?.interests),
      },
    };
  }

  return {};
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  verificationStatus: user.verificationStatus,
  isVerified: user.isVerified,
  isActive: user.isActive,
  profileImage: user.profileImage,
  bio: user.bio,
  studentProfile: user.studentProfile,
  mentorProfile: user.mentorProfile,
  placementOfficerProfile: user.placementOfficerProfile,
  publicProfile: user.publicProfile,
});

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const normalizedEmail = String(email || '').toLowerCase();
    const role = ROLE_VALUES.includes(req.body.role) ? req.body.role : 'student';

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login or use another email.' });
    }

    const pendingRegistration = {
      name,
      email: normalizedEmail,
      password: await bcryptjs.hash(password, 10),
      role,
      ...pickRoleProfile(role, req.body),
    };

    await sendOTP(normalizedEmail, { pendingRegistration });

    return res.status(201).json({
      success: true,
      message: 'Registration initiated. OTP sent to your email.',
      data: { email: normalizedEmail, role },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error during registration' });
  }
};

export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    const pendingRegistration = await verifyOTP(email, otp, { pendingRegistration: true });

    const existingUser = await User.findOne({ email: pendingRegistration.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }

    const user = new User({
      ...pendingRegistration,
      isEmailVerified: true,
      verificationStatus: 'pending',
      isVerified: false,
      isActive: false,
      approvalRequestDate: new Date(),
    });

    if (ADMIN_APPROVAL_ROLES.includes(user.role)) {
      user.verificationStatus = 'pending';
      user.isVerified = false;
      user.isActive = false;
      user.approvalRequestDate = user.approvalRequestDate || new Date();
      await sendStatusEmail(user.email, user.name, 'pending');
    } else {
      user.verificationStatus = 'approved';
      user.isVerified = true;
      user.isActive = true;
      user.verifiedAt = new Date();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isVerified ? 'Email verified successfully' : 'Email verified. Your account is pending admin approval.',
      data: {
        token: user.isVerified ? generateToken(user._id) : null,
        user: serializeUser(user),
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error verifying OTP' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your email first. Check your inbox for OTP.' });
    }

    if (ADMIN_APPROVAL_ROLES.includes(user.role) && user.verificationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: user.verificationStatus === 'rejected'
          ? `Your account approval was rejected${user.rejectionReason ? `: ${user.rejectionReason}` : '.'}`
          : 'Your account is pending admin approval.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account is not active yet.' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: generateToken(user._id),
        user: serializeUser(user),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error during login' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Please provide email' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your email before resetting your password.' });
    }

    await sendOTP(user.email);

    return res.status(200).json({ success: true, message: 'Password reset OTP sent to your email.', data: { email } });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error sending password reset OTP' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP, password, and confirm password' });
    }

    if (password !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords do not match' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const user = await verifyOTP(email, otp);
    user.password = await bcryptjs.hash(password, 10);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password reset successful. Please login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error resetting password' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, data: { user: serializeUser(user) } });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching profile' });
  }
};

export const listApprovalRequests = async (req, res) => {
  const users = await User.find({
    role: { $in: ADMIN_APPROVAL_ROLES },
    verificationStatus: 'pending',
    isEmailVerified: true,
  }).sort({ approvalRequestDate: 1 });

  res.json({ success: true, data: users.map(serializeUser) });
};

export const approveUser = async (req, res) => {
  const admin = await User.findById(req.userId);
  const target = await User.findById(req.params.userId);

  if (!target) return res.status(404).json({ success: false, message: 'User not found' });
  if (!admin?.isActive || !admin?.isVerified || admin.verificationStatus !== 'approved' || admin.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only approved admins can approve users' });
  }
  if (String(admin._id) === String(target._id)) return res.status(400).json({ success: false, message: 'Admin cannot self-approve' });
  if (!ADMIN_APPROVAL_ROLES.includes(target.role)) return res.status(400).json({ success: false, message: 'This role does not require admin approval' });
  if (!target.isEmailVerified) return res.status(400).json({ success: false, message: 'User must verify email before approval' });

  target.verificationStatus = 'approved';
  target.isVerified = true;
  target.isActive = true;
  target.verifiedBy = admin._id;
  target.verifiedAt = new Date();
  target.rejectionReason = '';
  await target.save();

  await ApprovalLog.create({ adminId: admin._id, targetUser: target._id, action: 'approved' });
  await sendStatusEmail(target.email, target.name, 'approved');

  res.json({ success: true, data: serializeUser(target), message: 'User approved' });
};

export const rejectUser = async (req, res) => {
  const admin = await User.findById(req.userId);
  const target = await User.findById(req.params.userId);
  const reason = req.body.reason || '';

  if (!target) return res.status(404).json({ success: false, message: 'User not found' });
  if (!admin?.isActive || !admin?.isVerified || admin.verificationStatus !== 'approved' || admin.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only approved admins can reject users' });
  }
  if (String(admin._id) === String(target._id)) return res.status(400).json({ success: false, message: 'Admin cannot self-reject' });
  if (!ADMIN_APPROVAL_ROLES.includes(target.role)) return res.status(400).json({ success: false, message: 'This role does not require admin approval' });

  target.verificationStatus = 'rejected';
  target.isVerified = false;
  target.isActive = false;
  target.verifiedBy = admin._id;
  target.verifiedAt = new Date();
  target.rejectionReason = reason;
  await target.save();

  await ApprovalLog.create({ adminId: admin._id, targetUser: target._id, action: 'rejected', reason });
  await sendStatusEmail(target.email, target.name, 'rejected', reason);

  res.json({ success: true, data: serializeUser(target), message: 'User rejected' });
};
