import CareerGoal from '../models/CareerGoal.js';
import { ensureCareerRoles } from '../utils/analysis.js';
import { logActivity } from '../utils/activityLogger.js';

const splitList = (value) => {
  if (Array.isArray(value)) return value;
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeCompanyTypes = (value) => {
  const companyTypeMap = {
    startup: 'Startup',
    'mid-size': 'Mid-size',
    midsize: 'Mid-size',
    'mid size': 'Mid-size',
    largecorp: 'Large Corp',
    'large corp': 'Large Corp',
    large: 'Large Corp',
    faang: 'FAANG',
    remote: 'Remote',
  };

  return splitList(value)
    .map((item) => companyTypeMap[String(item).trim().toLowerCase().replace(/\s+/g, ' ')] || item)
    .filter((item) => ['Startup', 'Mid-size', 'Large Corp', 'FAANG', 'Remote'].includes(item));
};

const normalizeGoalPayload = (body) => ({
  ...body,
  targetIndustry: splitList(body.targetIndustry),
  targetCompanyTypes: normalizeCompanyTypes(body.targetCompanyTypes),
  weeklyTimeCommitment: Number(body.weeklyTimeCommitment) || 10,
  desiredSalaryRange: {
    min: Number(body.desiredSalaryRange?.min) || 3,
    max: Number(body.desiredSalaryRange?.max) || 20,
  },
});

export const getGoals = async (req, res) => {
  const goal = await CareerGoal.findOne({ userId: req.userId, isActive: true }).populate('targetRoleId');
  res.json({ success: true, data: goal });
};

export const saveGoals = async (req, res, next) => {
  try {
    const roles = await ensureCareerRoles();
    const normalizedBody = normalizeGoalPayload(req.body);

    const role =
      roles.find(item => item.roleName === normalizedBody.targetRole) ||
      roles.find(item => String(item._id) === String(normalizedBody.targetRoleId));

    const payload = {
      ...normalizedBody,
      targetRoleId: role?._id,
      targetRole: normalizedBody.targetRole || role?.roleName,
    };

    const goal = await CareerGoal.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          ...payload,
          userId: req.userId,
          isActive: true,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await logActivity(
      req.userId,
      'Goal Saved',
      `Set target role to ${goal.targetRole}`,
      '/goals'
    );

    res.json({
      success: true,
      data: goal,
      message: 'Career goal saved',
    });
  } catch (error) {
    next(error);
  }
};
export const getRoles = async (req, res) => {
  const roles = await ensureCareerRoles();
  res.json({ success: true, data: roles });
};

export const recommendGoal = async (req, res) => {
  const roles = await ensureCareerRoles();
  const role = roles[0];
  res.json({ success: true, data: { targetRole: role.roleName, reason: `Based on your current profile, ${role.roleName} is a strong starting path.` } });
};
