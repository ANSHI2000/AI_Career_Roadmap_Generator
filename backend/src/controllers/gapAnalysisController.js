import { getUserGapAnalysis } from '../utils/analysis.js';

export const getGapAnalysis = async (req, res) => {
  const analysis = await getUserGapAnalysis(req.userId);
  res.json({ success: true, data: analysis });
};

export const getRecommendations = async (req, res) => {
  const analysis = await getUserGapAnalysis(req.userId);
  res.json({ success: true, data: analysis.recommendations });
};

export const analyzeRole = async (req, res) => {
  const analysis = await getUserGapAnalysis(req.userId, req.params.roleId);
  res.json({ success: true, data: analysis });
};
