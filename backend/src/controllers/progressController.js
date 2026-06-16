import Roadmap from '../models/Roadmap.js';
import { logActivity } from '../utils/activityLogger.js';
import { fileToDataUri } from '../utils/fileUpload.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const flattenTasks = (roadmap) => {
  const tasks = [];
  roadmap?.phases?.forEach((phase) => phase.milestones.forEach((milestone) => milestone.tasks.forEach((task) => tasks.push({ task, milestone, phase }))));
  return tasks;
};

export const getOverview = async (req, res) => {
  const roadmap = await Roadmap.findOne({ userId: req.userId, isActive: true });
  const tasks = flattenTasks(roadmap);
  const completed = tasks.filter(({ task }) => task.isCompleted).length;
  res.json({ success: true, data: { completion: tasks.length ? Math.round((completed / tasks.length) * 100) : 0, completedTasks: completed, totalTasks: tasks.length, streak: completed ? 1 : 0 } });
};

export const getActiveRoadmapProgress = async (req, res) => {
  const roadmap = await Roadmap.findOne({ userId: req.userId, isActive: true });
  res.json({ success: true, data: roadmap });
};

export const getTasks = async (req, res) => {
  const roadmap = await Roadmap.findOne({ userId: req.userId, isActive: true });
  const tasks = flattenTasks(roadmap).map(({ task, milestone, phase }) => ({ ...task.toObject(), milestoneTitle: milestone.title, phaseTitle: phase.title }));
  res.json({ success: true, data: tasks });
};

export const completeTask = async (req, res) => {
  const roadmap = await Roadmap.findOne({ userId: req.userId, 'phases.milestones.tasks._id': req.params.taskId });
  if (!roadmap) return res.status(404).json({ success: false, message: 'Task not found' });
  let updatedTask;
  roadmap.phases.forEach((phase) => phase.milestones.forEach((milestone) => milestone.tasks.forEach((task) => {
    if (String(task._id) === req.params.taskId) {
      task.isCompleted = req.body.isCompleted ?? true;
      task.completedAt = task.isCompleted ? new Date() : undefined;
      updatedTask = task;
    }
  })));
  roadmap.calculateCompletion();
  await roadmap.save();
  await logActivity(req.userId, 'Task Updated', `${updatedTask?.title || 'Task'} marked ${updatedTask?.isCompleted ? 'complete' : 'pending'}`, '/progress');
  res.json({ success: true, data: roadmap, message: 'Task updated' });
};

export const uploadTaskEvidence = async (req, res) => {
  const url = req.file ? await uploadToCloudinary(fileToDataUri(req.file), 'career-roadmap/task-evidence') : '';
  res.json({ success: true, data: { url, notes: req.body.notes || '' }, message: 'Evidence saved' });
};

export const getAnalytics = async (req, res) => {
  res.json({ success: true, data: { weekly: [], estimatedVsActual: [], skillGrowth: [] } });
};

export const logTime = async (req, res) => {
  res.json({ success: true, data: { taskId: req.params.taskId, hours: Number(req.body.hours) || 0 }, message: 'Time logged' });
};
