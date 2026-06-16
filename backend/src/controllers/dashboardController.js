import Activity from '../models/Activity.js';
import Profile from '../models/Profile.js';
import Roadmap from '../models/Roadmap.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { getUserGapAnalysis } from '../utils/analysis.js';

export const getDashboardStats = async (req, res) => {
  const userId = req.userId;
  const [user, profile, skills, activeRoadmap, analysis] = await Promise.all([
    User.findById(userId).select('name email'),
    Profile.findOne({ userId }),
    Skill.find({ userId }),
    Roadmap.findOne({ userId, isActive: true }),
    getUserGapAnalysis(userId),
  ]);
  const requiredCount = analysis.requiredSkills.length;
  const acquiredCount = requiredCount - analysis.missingSkills.length;
  res.json({ success: true, data: { user, readinessScore: analysis.matchPercentage, skillCoverage: { acquired: acquiredCount, required: requiredCount }, roadmapCompletion: activeRoadmap?.completionPercentage || 0, profileCompletion: profile?.profileCompletion || 0, activeRoadmap, totalSkills: skills.length } });
};

export const getRecentActivity = async (req, res) => {
  const activity = await Activity.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(5);
  res.json({ success: true, data: activity.map((item) => ({ action: item.description || item.action, timestamp: item.createdAt, link: item.link })) });
};

export const getNextAction = async (req, res) => {
  const userId = req.userId;
  const [profile, skills, roadmap, analysis] = await Promise.all([Profile.findOne({ userId }), Skill.countDocuments({ userId }), Roadmap.findOne({ userId, isActive: true }), getUserGapAnalysis(userId)]);
  let action = { title: 'Review your gap analysis', description: `${analysis.missingSkills.length} required skills are still missing for your target role.`, buttonText: 'View Gap Analysis', navigateTo: '/gap-analysis' };
  if (!profile || profile.profileCompletion < 70) action = { title: 'Complete your career profile', description: 'Add education, links, and experience so recommendations can improve.', buttonText: 'Update Profile', navigateTo: '/profile' };
  else if (skills < 3) action = { title: 'Build your skill inventory', description: 'Add at least 3 skills to unlock better readiness scoring.', buttonText: 'Add Skills', navigateTo: '/skills' };
  else if (!roadmap) action = { title: 'Generate your first roadmap', description: 'Turn skill gaps into a milestone-based learning plan.', buttonText: 'Generate Roadmap', navigateTo: '/roadmap' };
  res.json({ success: true, data: action });
};

export const getPlacementAnalytics = async (req, res) => {
  const [students, roadmaps, skills] = await Promise.all([
    User.find({ role: 'student', isVerified: true }).select('name email studentProfile createdAt'),
    Roadmap.find({}).select('userId targetRole readinessScore completionPercentage updatedAt'),
    Skill.find({}).select('userId skillName category proficiencyLevel'),
  ]);

  const roadmapByUser = new Map(roadmaps.map((roadmap) => [String(roadmap.userId), roadmap]));
  const skillsByUser = skills.reduce((acc, skill) => {
    const key = String(skill.userId);
    acc.set(key, [...(acc.get(key) || []), skill]);
    return acc;
  }, new Map());

  const studentReadiness = students.map((student) => {
    const roadmap = roadmapByUser.get(String(student._id));
    const studentSkills = skillsByUser.get(String(student._id)) || [];
    return {
      id: student._id,
      name: student.name,
      email: student.email,
      targetRole: student.studentProfile?.targetRole || roadmap?.targetRole || 'Not set',
      readinessScore: roadmap?.readinessScore || 0,
      roadmapCompletion: roadmap?.completionPercentage || 0,
      skillsCount: studentSkills.length,
      currentYear: student.studentProfile?.currentYear || 'Not set',
    };
  });

  const readyStudents = studentReadiness.filter((student) => student.readinessScore >= 70).length;
  const averageReadiness = studentReadiness.length
    ? Math.round(studentReadiness.reduce((sum, student) => sum + student.readinessScore, 0) / studentReadiness.length)
    : 0;

  res.json({
    success: true,
    data: {
      totalStudents: students.length,
      readyStudents,
      averageReadiness,
      students: studentReadiness,
      reports: [
        { title: 'Placement readiness', value: `${readyStudents}/${students.length}`, description: 'Students at 70+ readiness score' },
        { title: 'Average readiness', value: `${averageReadiness}%`, description: 'Across verified students with roadmap data' },
        { title: 'Skill records', value: skills.length, description: 'Total tracked skills for placement analysis' },
      ],
    },
  });
};
