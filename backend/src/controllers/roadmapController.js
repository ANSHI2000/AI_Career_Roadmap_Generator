import PDFDocument from 'pdfkit';
import Roadmap from '../models/Roadmap.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import openai from '../config/openai.js';
import { getUserGapAnalysis } from '../utils/analysis.js';
import { logActivity } from '../utils/activityLogger.js';
import { createNotification } from '../utils/notificationHelper.js';

const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const normalizeTimeline = (timeline = '6 months') => {
  if (timeline === '1 year') return '12 months';
  if (timeline === '2 years') return '24 months';
  return ['3 months', '6 months', '12 months', '24 months'].includes(timeline) ? timeline : '6 months';
};

const parseMonths = (timeline = '6 months') => Number(timeline.split(' ')[0]) || 6;

const hoursFromIntensity = (learningIntensity, weeklyHours = 10) => {
  const fallback = learningIntensity === 'Intense' ? 20 : learningIntensity === 'Casual' ? 6 : 10;
  return Number(weeklyHours) || fallback;
};

const cleanList = (items = [], fallback = []) => {
  const source = Array.isArray(items) ? items : String(items || '').split(',');
  const values = source.map((item) => String(item || '').trim()).filter(Boolean);
  return values.length ? values : fallback;
};

const extractJson = (text = '') => {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return JSON.parse(trimmed);
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI response did not contain JSON');
  return JSON.parse(match[0]);
};

const getYearFocus = (yearOfStudy = '') => {
  const focusByYear = {
    '1st': 'Focus on fundamentals, career exploration, programming/computing foundations, study habits, and small guided projects.',
    '2nd': 'Focus on practical skills, hands-on projects, tooling fluency, collaborative work, and portfolio building.',
    '3rd': 'Focus on internships, advanced projects, interview preparation, real-world engineering practices, and recruiter-visible proof.',
    '4th': 'Focus on placement readiness, resume building, system design, mock interviews, job applications, and offer conversion.',
  };
  return focusByYear[yearOfStudy] || 'Focus on the next realistic step based on the student profile, skill gaps, projects, and career timeline.';
};

const buildStudentContext = async (userId, analysis, body) => {
  const [user, profile, projects] = await Promise.all([
    User.findById(userId),
    Profile.findOne({ userId }),
    Project.find({ userId }).sort({ updatedAt: -1 }).limit(8),
  ]);
  const goal = analysis.goal;
  const studentProfile = user?.studentProfile || {};
  const timeline = normalizeTimeline(body.timeline || goal?.targetTimeline);
  const currentYear = body.currentYear || studentProfile.currentYear || profile?.yearOfStudy || 'Not provided';
  const targetRole = body.targetRole || studentProfile.targetRole || analysis.role?.roleName || goal?.targetRole || 'Target Role';
  const profileSkills = cleanList(body.skills || studentProfile.skills, []);
  const knownTechnologies = cleanList(body.technologies || projects.flatMap((project) => project.technologies), ['Not provided']);
  return {
    platformRole: user?.role || 'student',
    currentYearOfStudy: currentYear,
    yearSpecificFocus: getYearFocus(currentYear),
    education: body.degree || studentProfile.degree || profile?.currentEducation || 'Not provided',
    fieldOfStudy: body.branch || studentProfile.branch || profile?.fieldOfStudy || 'Not provided',
    college: body.college || studentProfile.college || 'Not provided',
    cgpa: body.cgpa || 'Not provided',
    currentRole: profile?.currentRole || 'Student',
    targetRole,
    targetCompanyType: cleanList(body.targetCompanyTypes || goal?.targetCompanyTypes, ['General product company']),
    learningTimeframe: timeline,
    weeklyStudyHours: hoursFromIntensity(body.learningIntensity, body.weeklyHours || goal?.weeklyTimeCommitment),
    learningIntensity: body.learningIntensity || 'Moderate',
    preferredLearningStyle: goal?.preferredLearningStyle || 'Self-paced',
    experience: body.experience || profile?.yearsOfExperience || 0,
    careerGoals: {
      goal: body.careerGoal || 'Not provided',
      targetIndustry: cleanList(body.targetIndustry || goal?.targetIndustry, ['Technology']),
      desiredSalaryRange: goal?.desiredSalaryRange || null,
      targetTimeline: goal?.targetTimeline || timeline,
    },
    currentSkills: [
      ...analysis.userSkills.map((skill) => ({
        skillName: skill.skillName,
        category: skill.category,
        proficiencyLevel: skill.proficiencyLevel,
        yearsOfExperience: skill.yearsOfExperience,
        evidence: skill.evidence?.type || 'None',
      })),
      ...profileSkills.map((skillName) => ({ skillName, category: 'Profile', proficiencyLevel: 1, yearsOfExperience: 0, evidence: 'Signup profile' })),
    ],
    knownTechnologies,
    skillGaps: {
      missing: analysis.missingSkills.map((skill) => skill.skillName),
      needsImprovement: analysis.improvementSkills.map((skill) => `${skill.skillName} (${skill.currentLevel}/${skill.requiredLevel})`),
      matchPercentage: analysis.matchPercentage,
    },
    existingProjects: [
      ...projects.map((project) => ({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      status: project.status,
      progressPercentage: project.progressPercentage,
      hasGithub: Boolean(project.githubLink),
      hasLiveDemo: Boolean(project.liveDemoUrl),
      })),
      ...cleanList(body.projects, []).map((title) => ({ title, description: 'Provided in roadmap request', technologies: knownTechnologies, status: 'Completed' })),
    ],
  };
};

const task = (title, description, estimatedHours) => ({ title, description, estimatedHours });

const buildPhaseDescription = (phase) => [
  `Duration: ${phase.duration || 'Planned phase'}`,
  `Topics: ${cleanList(phase.topics, ['Core role fundamentals']).join('; ')}`,
  `Projects: ${cleanList(phase.projects, ['Portfolio-quality applied project']).join('; ')}`,
  `Deliverables: ${cleanList(phase.deliverables, ['Demonstrable progress toward the target role']).join('; ')}`,
  `Interview preparation: ${cleanList(phase.interviewPreparation, ['Practice role-specific interview questions']).join('; ')}`,
].join('\n');

const sanitizeRoadmap = (roadmap, context) => {
  const timeline = normalizeTimeline(context.learningTimeframe);
  const months = parseMonths(timeline);
  const phases = Array.isArray(roadmap.roadmap) ? roadmap.roadmap : Array.isArray(roadmap.phases) ? roadmap.phases : [];
  const readinessScore = Math.max(0, Math.min(100, Number(roadmap.readinessScore) || context.skillGaps.matchPercentage || 0));
  return {
    title: String(roadmap.title || `${context.targetRole} Roadmap`).slice(0, 120),
    role: String(roadmap.role || context.targetRole),
    timeframe: String(roadmap.timeframe || timeline),
    readinessScore,
    skillGapAnalysis: cleanList(roadmap.skillGapAnalysis, context.skillGaps.missing),
    monthlyMilestones: cleanList(roadmap.monthlyMilestones, [`Month 1: begin closing ${context.skillGaps.missing.slice(0, 2).join(', ') || 'highest priority gaps'}`]),
    projectsToBuild: cleanList(roadmap.projectsToBuild || phases.flatMap((phase) => phase.projects || []), ['Build one role-aligned portfolio project']),
    certifications: cleanList(roadmap.certifications, []),
    resumeSuggestions: cleanList(roadmap.resumeSuggestions, ['Add measurable project outcomes and role-specific keywords']),
    jobStrategy: cleanList(roadmap.jobStrategy, ['Apply with tailored resume versions and project proof links']),
    finalOutcome: String(roadmap.finalOutcome || `Ready to pursue ${context.targetRole} opportunities with targeted portfolio evidence.`),
    targetRole: context.targetRole,
    timeline,
    learningIntensity: context.learningIntensity,
    startDate: new Date(),
    endDate: addMonths(new Date(), months),
    phases: phases.slice(0, months <= 3 ? 3 : 4).map((phase, index) => {
      const weeklyHours = Math.max(4, Math.round(context.weeklyStudyHours / 2));
      return {
        title: String(phase.phase || phase.title || `Phase ${index + 1}`).slice(0, 100),
        description: buildPhaseDescription(phase),
        order: index + 1,
        milestones: [
          {
            title: `Learn: ${cleanList(phase.topics, ['Role fundamentals']).slice(0, 3).join(', ')}`,
            description: `Build practical understanding for ${context.targetRole}.`,
            estimatedHours: weeklyHours,
            status: 'Not Started',
            tasks: cleanList(phase.topics, ['Role fundamentals']).slice(0, 4).map((topic) => task(`Study ${topic}`, `Focus on concepts that apply directly to ${context.targetRole} work.`, Math.max(2, Math.round(weeklyHours / 4)))),
          },
          {
            title: `Build: ${cleanList(phase.projects, ['Applied portfolio project'])[0]}`,
            description: cleanList(phase.deliverables, ['Create proof of practical skill']).join('; '),
            estimatedHours: weeklyHours,
            status: 'Not Started',
            tasks: cleanList(phase.projects, ['Applied portfolio project']).slice(0, 3).map((project) => task(`Ship ${project}`, `Scope it to the student's timeframe, current skills, and target company expectations.`, Math.max(3, Math.round(weeklyHours / 3)))),
          },
          {
            title: 'Interview and portfolio proof',
            description: cleanList(phase.deliverables, ['Publish clear evidence of the work']).join('; '),
            estimatedHours: Math.max(3, Math.round(weeklyHours / 2)),
            status: 'Not Started',
            tasks: [
              ...cleanList(phase.interviewPreparation, ['Practice role-specific interview questions']).slice(0, 3).map((item) => task(item, `Prepare this for ${context.targetCompanyType.join(', ')} hiring screens.`, 2)),
              ...cleanList(phase.deliverables, ['Update portfolio case study']).slice(0, 2).map((item) => task(item, 'Make the evidence visible to recruiters and hiring managers.', 2)),
            ],
          },
        ],
      };
    }),
  };
};

const buildRoadmapPrompt = (context) => `
You are an expert career mentor, hiring manager, and technical educator.

Generate a personalized career roadmap for this student. Do not use predefined templates. Analyze the profile and create a unique plan that changes based on current year of study, target role, current skills, target company type, learning timeframe, weekly study hours, existing projects, and career goals.

Reflect current 2026 industry standards, modern technologies, and hiring trends. Keep it realistic for ${context.learningTimeframe} at ${context.weeklyStudyHours} hours per week.
Year-specific planning rule: ${context.yearSpecificFocus}

Student profile JSON:
${JSON.stringify(context, null, 2)}

Return only valid JSON with this exact shape:
{
  "role": "",
  "timeframe": "",
  "readinessScore": 0,
  "skillGapAnalysis": [],
  "roadmap": [
    {
      "phase": "",
      "duration": "",
      "topics": [],
      "projects": [],
      "deliverables": [],
      "interviewPreparation": []
    }
  ],
  "monthlyMilestones": [],
  "projectsToBuild": [],
  "certifications": [],
  "resumeSuggestions": [],
  "jobStrategy": [],
  "finalOutcome": ""
}

Rules:
- Include 3 phases for a 3 month plan and 4 phases for longer plans.
- Include skill gap analysis, monthly milestones, projects to build, certifications if useful, resume improvement suggestions, interview preparation, job application strategy, and an estimated readiness score.
- Follow the year-specific planning rule exactly: 1st year means fundamentals/exploration/foundations; 2nd year means projects/practical skills; 3rd year means internships/advanced projects/interview preparation; 4th year means placement readiness/resume/system design/job applications.
- Make every section specific to this student's current skills, known technologies, CGPA, gaps, completed projects, company targets, and career goals.
- Recommend project ideas that extend or improve completed projects when useful.
- Do not include generic advice or fixed roadmaps.
- Do not include markdown, explanations, comments, or text outside JSON.
`;

const buildAIRoadmap = async (context) => {
  if (!openai) return null;

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: buildRoadmapPrompt(context),
      temperature: 0.7,
      max_output_tokens: 3000,
    });
    const parsed = extractJson(response.output_text || '');
    return sanitizeRoadmap(parsed, context);
  } catch (error) {
    console.error('AI roadmap generation failed:', error.message);
    return null;
  }
};

const buildFallbackRoadmap = (analysis, context) => {
  const timeline = normalizeTimeline(context.learningTimeframe);
  const months = parseMonths(timeline);
  const recommendations = analysis.recommendations.length ? analysis.recommendations : analysis.requiredSkills.slice(0, 6).map((skill) => ({ skillName: skill.skillName, priority: skill.priority }));
  const currentSkillNames = context.currentSkills.map((skill) => skill.skillName);
  const existingProject = context.existingProjects[0]?.title;
  const companyType = context.targetCompanyType[0] || 'product company';
  const phaseCount = months <= 3 ? 3 : 4;
  const phaseSize = Math.max(1, Math.ceil(recommendations.length / phaseCount));
  const phaseNamesByYear = {
    '1st': ['Academic Base and Tooling', 'Guided Practice', 'Mini Portfolio Proof', 'Peer Review Readiness'],
    '2nd': ['Role Foundations', 'Applied Skill Building', 'Team-Style Project Work', 'Internship Screening Prep'],
    '3rd': ['Gap Closure', 'Recruiter-Visible Projects', 'System and Interview Practice', 'Internship or Placement Readiness'],
    '4th': ['Hiring Gap Closure', 'Capstone Upgrade', 'Interview Sprint', 'Application Portfolio Polish'],
    Graduated: ['Production Skill Refresh', 'Experience-Led Portfolio', 'Interview Sprint', 'Job Search Execution'],
  };
  const titles = phaseNamesByYear[context.currentYearOfStudy] || phaseNamesByYear['3rd'];
  const yearFocusTopic = {
    '1st': 'fundamentals, exploration, and foundation building',
    '2nd': 'practical project execution and hands-on skills',
    '3rd': 'internship readiness, advanced projects, and interview preparation',
    '4th': 'placement readiness, resume polish, system design, and job applications',
    Graduated: 'job readiness, portfolio proof, and application execution',
  }[context.currentYearOfStudy] || 'profile-specific career readiness';
  const phases = Array.from({ length: phaseCount }, (_, index) => {
    const group = recommendations.slice(index * phaseSize, (index + 1) * phaseSize);
    const skills = group.length ? group.map((item) => item.skillName) : recommendations.slice(0, 2).map((item) => item.skillName);
    const projectBase = existingProject ? `upgrade "${existingProject}" with ${skills.join(', ')}` : `build a ${context.targetRole} portfolio project using ${skills.join(', ')}`;
    return {
      phase: titles[index] || `Phase ${index + 1}`,
      duration: months <= 3 ? `Month ${index + 1}` : `${Math.max(1, Math.floor((index * months) / phaseCount) + 1)}-${Math.ceil(((index + 1) * months) / phaseCount)} months`,
      topics: [
        yearFocusTopic,
        ...skills,
        companyType === 'Startup' ? 'rapid prototyping and ownership tradeoffs' : companyType === 'FAANG' ? 'data structures, system design basics, and code quality' : 'collaboration workflows and production quality',
      ],
      projects: [
        projectBase,
        `${context.targetRole} case study aligned with ${context.careerGoals.targetIndustry.join(', ')}`,
      ],
      deliverables: [
        context.yearSpecificFocus,
        `A measurable improvement from ${analysis.matchPercentage}% role match`,
        `Working proof that connects ${currentSkillNames.slice(0, 3).join(', ') || 'current strengths'} with ${skills.join(', ')}`,
        'GitHub README with problem, architecture, setup, screenshots, and tradeoffs',
        'Live demo or recorded walkthrough',
        `Resume bullet quantifying the ${context.targetRole} outcome`,
      ],
      interviewPreparation: [
        `Practice ${context.targetRole} questions around ${skills.join(', ')}`,
        `Prepare STAR stories from ${existingProject || 'new portfolio work'}`,
        `Run one mock screen focused on ${companyType} expectations`,
      ],
    };
  });

  const projectIdeas = phases.flatMap((phase) => phase.projects).slice(0, 6);
  const targetReadiness = Math.min(92, Math.max(analysis.matchPercentage + 25, analysis.matchPercentage || 45));

  return {
    title: `${context.targetRole} Roadmap for ${context.currentYearOfStudy === 'Not provided' ? 'Your Profile' : `${context.currentYearOfStudy} Year`}`,
    role: context.targetRole,
    timeframe: timeline,
    readinessScore: targetReadiness,
    skillGapAnalysis: [
      ...analysis.missingSkills.map((skill) => `Missing: ${skill.skillName} (${skill.priority || 'Must Have'})`),
      ...analysis.improvementSkills.map((skill) => `Improve: ${skill.skillName} from level ${skill.currentLevel} to ${skill.requiredLevel}`),
    ],
    monthlyMilestones: Array.from({ length: months }, (_, index) => {
      const phase = phases[Math.min(phases.length - 1, Math.floor((index / months) * phases.length))];
      return `Month ${index + 1}: ${phase.phase} - ${phase.deliverables[0]}`;
    }),
    projectsToBuild: projectIdeas,
    certifications: companyType === 'FAANG' ? [] : [`Optional ${context.targetRole} certification only if it produces a portfolio artifact`],
    resumeSuggestions: [
      `Lead with ${context.targetRole} projects using ${context.knownTechnologies.slice(0, 4).join(', ')}`,
      'Add quantified outcomes, live demo links, GitHub links, and concise technical tradeoffs',
      `Tailor keywords for ${companyType} job descriptions`,
    ],
    jobStrategy: [
      `Apply to ${companyType} roles after the first portfolio project is published`,
      'Use referrals, alumni, and LinkedIn messages with one project proof link',
      'Track applications weekly and revise resume based on response rate',
    ],
    finalOutcome: `By the end of ${timeline}, the student should have targeted skills, portfolio evidence, interview practice, and an application plan for ${context.targetRole} roles.`,
    targetRole: context.targetRole,
    timeline,
    learningIntensity: context.learningIntensity,
    startDate: new Date(),
    endDate: addMonths(new Date(), months),
    phases: phases.map((phase, index) => sanitizeRoadmap({ title: '', phases: [phase] }, context).phases[0]).map((phase, index) => ({ ...phase, order: index + 1 })),
  };
};

export const generateRoadmap = async (req, res) => {
  const analysis = await getUserGapAnalysis(req.userId, req.body.roleId);
  const context = await buildStudentContext(req.userId, analysis, req.body);
  const roadmapData = await buildAIRoadmap(context) || buildFallbackRoadmap(analysis, context);
  await Roadmap.updateMany({ userId: req.userId }, { $set: { isActive: false } });
  const roadmap = await Roadmap.create({ ...roadmapData, userId: req.userId, isActive: true, isAIGenerated: true });
  await logActivity(req.userId, 'Roadmap Generated', `Generated roadmap for ${roadmap.targetRole}`, '/roadmap');
  await createNotification(req.userId, 'Roadmap Generated', 'Roadmap generated', `${roadmap.title} is ready.`, '/roadmap');
  res.status(201).json({ success: true, data: roadmap, message: 'Roadmap generated' });
};

export const listRoadmaps = async (req, res) => {
  const roadmaps = await Roadmap.find({ userId: req.userId }).sort({ updatedAt: -1 });
  res.json({ success: true, data: roadmaps });
};

export const getRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.userId });
  if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
  res.json({ success: true, data: roadmap });
};

export const saveRoadmap = async (req, res) => {
  const roadmap = await Roadmap.create({ ...req.body, userId: req.userId });
  await logActivity(req.userId, 'Roadmap Saved', `Saved ${roadmap.title}`, '/roadmap');
  res.status(201).json({ success: true, data: roadmap, message: 'Roadmap saved' });
};

export const updateRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: req.body }, { new: true, runValidators: true });
  if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
  roadmap.calculateCompletion();
  await roadmap.save();
  res.json({ success: true, data: roadmap, message: 'Roadmap updated' });
};

export const deleteRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
  res.json({ success: true, message: 'Roadmap deleted' });
};

export const setActiveRoadmap = async (req, res) => {
  await Roadmap.updateMany({ userId: req.userId }, { $set: { isActive: false } });
  const roadmap = await Roadmap.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: { isActive: true } }, { new: true });
  if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
  res.json({ success: true, data: roadmap, message: 'Active roadmap updated' });
};

export const exportRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.userId });
  if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${roadmap.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`);
  const doc = new PDFDocument({ margin: 48 });
  doc.pipe(res);
  doc.fontSize(22).text(roadmap.title);
  doc.fontSize(12).text(`Target role: ${roadmap.targetRole}`);
  roadmap.phases.forEach((phase) => {
    doc.moveDown().fontSize(16).text(phase.title);
    phase.milestones.forEach((milestone) => {
      doc.fontSize(12).text(`- ${milestone.title} (${milestone.status})`);
      milestone.tasks.forEach((task) => doc.fontSize(10).text(`  * ${task.title}`));
    });
  });
  doc.end();
};
