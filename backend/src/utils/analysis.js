import CareerGoal from '../models/CareerGoal.js';
import CareerRole from '../models/CareerRole.js';
import Skill from '../models/Skill.js';
import { defaultCareerRoles } from './careerData.js';

const normalize = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/\+/g, ' plus ')
  .replace(/#/g, ' sharp ')
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const skillAliases = {
  ai: 'artificial intelligence',
  api: 'apis',
  backend: 'back end',
  css3: 'css',
  db: 'database',
  expressjs: 'express',
  html5: 'html',
  js: 'javascript',
  mongo: 'mongodb',
  mongoose: 'mongodb',
  node: 'node js',
  nodejs: 'node js',
  reactjs: 'react',
  restapi: 'rest apis',
  restapis: 'rest apis',
  tailwindcss: 'tailwind css',
};

const canonicalSkill = (value) => {
  const compact = normalize(value).replace(/\s/g, '');
  return skillAliases[compact] || normalize(value);
};

const findMatchingSkill = (userSkillMap, requiredName) => {
  const requiredKey = canonicalSkill(requiredName);
  if (userSkillMap.has(requiredKey)) return userSkillMap.get(requiredKey);

  for (const [skillKey, skill] of userSkillMap.entries()) {
    if (skillKey.includes(requiredKey) || requiredKey.includes(skillKey)) return skill;
  }

  return null;
};

export const ensureCareerRoles = async () => {
  const count = await CareerRole.countDocuments();
  if (count === 0) {
    await CareerRole.insertMany(defaultCareerRoles);
  }
  return CareerRole.find({ isActive: true }).sort({ roleName: 1 });
};

export const getUserGapAnalysis = async (userId, roleId = null) => {
  const roles = await ensureCareerRoles();
  const goal = await CareerGoal.findOne({ userId, isActive: true });
  let role = null;

  if (roleId) role = await CareerRole.findById(roleId);
  if (!role && goal?.targetRoleId) role = await CareerRole.findById(goal.targetRoleId);
  if (!role && goal?.targetRole) role = roles.find((item) => item.roleName === goal.targetRole);
  if (!role) role = roles[0];

  const skills = await Skill.find({ userId }).sort({ updatedAt: -1 });
  const userSkillMap = new Map(skills.map((skill) => [canonicalSkill(skill.skillName), skill]));
  const requiredSkills = role?.requiredSkills || [];

  const missingSkills = [];
  const improvementSkills = [];
  let matchedScore = 0;
  const categoryTotals = {};
  const categoryMatchedScore = {};

  requiredSkills.forEach((required) => {
    const category = required.category || 'Technical';
    categoryTotals[category] = (categoryTotals[category] || 0) + 1;
    const current = findMatchingSkill(userSkillMap, required.skillName);

    if (!current) {
      missingSkills.push(required);
      return;
    }

    const currentLevel = Number(current.proficiencyLevel) || 0;
    const requiredLevel = Number(required.minimumProficiency) || 1;
    const skillScore = Math.min(currentLevel / requiredLevel, 1);
    matchedScore += skillScore;
    categoryMatchedScore[category] = (categoryMatchedScore[category] || 0) + skillScore;

    if (currentLevel >= requiredLevel) {
      return;
    } else {
      improvementSkills.push({
        skillName: required.skillName,
        category,
        currentLevel,
        requiredLevel,
      });
    }
  });

  const matchPercentage = requiredSkills.length ? Math.round((matchedScore / requiredSkills.length) * 100) : 0;
  const categoryWiseMatch = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    percentage: Math.round(((categoryMatchedScore[category] || 0) / total) * 100),
  }));

  const recommendations = [...missingSkills, ...improvementSkills].slice(0, 5).map((skill) => {
    const targetLevel = Number(skill.minimumProficiency || skill.requiredLevel) || 2;
    return {
      skillName: skill.skillName,
      priority: skill.priority || 'Must Have',
      estimatedTime: targetLevel >= 3 ? '3-4 weeks' : '1-2 weeks',
      resources: [
        { title: `${skill.skillName} fundamentals`, url: `https://www.google.com/search?q=${encodeURIComponent(skill.skillName + ' course')}` },
      ],
    };
  });

  return {
    role,
    goal,
    userSkills: skills,
    requiredSkills,
    missingSkills,
    improvementSkills,
    matchPercentage,
    categoryWiseMatch,
    recommendations,
  };
};
