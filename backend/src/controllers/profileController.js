import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { logActivity } from '../utils/activityLogger.js';
import { fileToDataUri } from '../utils/fileUpload.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const getOrCreateProfile = async (userId) => {
  const user = await User.findById(userId).select('name email profileImage bio');
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = await Profile.create({ userId, fullName: user?.name || '', bio: user?.bio || '', profilePicture: user?.profileImage || '' });
    profile.calculateCompletion();
    await profile.save();
  }
  return { user, profile };
};

export const getProfile = async (req, res) => {
  const { user, profile } = await getOrCreateProfile(req.userId);
  res.json({ success: true, data: { ...profile.toObject(), email: user.email } });
};

export const updateProfile = async (req, res) => {
  const updates = { ...req.body };
  delete updates.email;
  const profile = await Profile.findOneAndUpdate({ userId: req.userId }, { $set: updates }, { new: true, upsert: true, runValidators: true });
  profile.calculateCompletion();
  await profile.save();
  await User.findByIdAndUpdate(req.userId, { name: profile.fullName, bio: profile.bio, profileImage: profile.profilePicture });
  await logActivity(req.userId, 'Profile Updated', 'Updated career profile', '/profile');
  res.json({ success: true, data: profile, message: 'Profile updated' });
};

export const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
  const url = await uploadToCloudinary(fileToDataUri(req.file), 'career-roadmap/avatars');
  const profile = await Profile.findOneAndUpdate({ userId: req.userId }, { $set: { profilePicture: url } }, { new: true, upsert: true });
  profile.calculateCompletion();
  await profile.save();
  await User.findByIdAndUpdate(req.userId, { profileImage: url });
  await logActivity(req.userId, 'Avatar Uploaded', 'Uploaded profile picture', '/profile');
  res.json({ success: true, data: { url, profile }, message: 'Profile picture uploaded' });
};
