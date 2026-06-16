import Skill from '../models/Skill.js';
import { logActivity } from '../utils/activityLogger.js';
import { fileToDataUri } from '../utils/fileUpload.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getSkills = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 9, 50);
  const query = { userId: req.userId };
  if (req.query.category && req.query.category !== 'All') query.category = req.query.category;
  if (req.query.search) query.skillName = { $regex: req.query.search, $options: 'i' };
  const [items, total] = await Promise.all([Skill.find(query).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit), Skill.countDocuments(query)]);
  res.json({ success: true, data: { items, total, page, pages: Math.ceil(total / limit) || 1 } });
};

export const createSkill = async (req, res) => {
  const skill = await Skill.create({ ...req.body, userId: req.userId });
  await logActivity(req.userId, 'Skill Added', `Added ${skill.skillName} skill`, '/skills');
  res.status(201).json({ success: true, data: skill, message: 'Skill added' });
};

export const updateSkill = async (req, res) => {
  const skill = await Skill.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: req.body }, { new: true, runValidators: true });
  if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
  await logActivity(req.userId, 'Skill Updated', `Updated ${skill.skillName}`, '/skills');
  res.json({ success: true, data: skill, message: 'Skill updated' });
};

export const deleteSkill = async (req, res) => {
  const skill = await Skill.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
  await logActivity(req.userId, 'Skill Deleted', `Deleted ${skill.skillName}`, '/skills');
  res.json({ success: true, message: 'Skill deleted' });
};

export const uploadEvidence = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No evidence file uploaded' });
  const url = await uploadToCloudinary(fileToDataUri(req.file), 'career-roadmap/evidence');
  res.json({ success: true, data: { url }, message: 'Evidence uploaded' });
};
