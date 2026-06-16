import Project from '../models/Project.js';
import { logActivity } from '../utils/activityLogger.js';
import { fileToDataUri } from '../utils/fileUpload.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const listProjects = async (req, res) => {
  const query = { userId: req.userId };
  if (req.query.status && req.query.status !== 'All') query.status = req.query.status;
  if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };
  const projects = await Project.find(query).populate('skillsUsed').sort({ updatedAt: -1 });
  res.json({ success: true, data: projects });
};

export const createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, userId: req.userId });
  await logActivity(req.userId, 'Project Added', `Added ${project.title}`, '/projects');
  res.status(201).json({ success: true, data: project, message: 'Project created' });
};

export const getProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.userId }).populate('skillsUsed');
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

export const updateProject = async (req, res) => {
  const project = await Project.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: req.body }, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project, message: 'Project updated' });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
};

export const uploadScreenshots = async (req, res) => {
  const urls = [];
  for (const file of req.files || []) {
    urls.push(await uploadToCloudinary(fileToDataUri(file), 'career-roadmap/projects'));
  }
  const project = await Project.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $push: { screenshots: { $each: urls } }, $set: { thumbnailImage: urls[0] } }, { new: true });
  res.json({ success: true, data: { urls, project }, message: 'Screenshots uploaded' });
};
