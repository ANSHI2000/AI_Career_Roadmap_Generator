export const defaultCareerRoles = [
  {
    roleName: 'Frontend Developer',
    description: 'Build accessible, responsive user interfaces with modern web tooling.',
    category: 'Software',
    requiredSkills: [
      { skillName: 'HTML', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'CSS', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'JavaScript', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'React', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'Git', category: 'Tool', minimumProficiency: 2 },
      { skillName: 'Communication', category: 'Soft Skill', minimumProficiency: 2 },
    ],
    averageSalary: { min: 5, max: 24 },
  },
  {
    roleName: 'Backend Developer',
    description: 'Design APIs, databases, and server-side systems.',
    category: 'Software',
    requiredSkills: [
      { skillName: 'Node.js', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'Express', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'MongoDB', category: 'Technical', minimumProficiency: 2 },
      { skillName: 'REST APIs', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'Git', category: 'Tool', minimumProficiency: 2 },
    ],
    averageSalary: { min: 6, max: 28 },
  },
  {
    roleName: 'AI Engineer',
    description: 'Build AI-powered applications using ML, LLMs, and data pipelines.',
    category: 'AI',
    requiredSkills: [
      { skillName: 'Python', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'Machine Learning', category: 'Technical', minimumProficiency: 3 },
      { skillName: 'Prompt Engineering', category: 'Technical', minimumProficiency: 2 },
      { skillName: 'APIs', category: 'Technical', minimumProficiency: 2 },
      { skillName: 'Data Analysis', category: 'Technical', minimumProficiency: 2 },
    ],
    averageSalary: { min: 8, max: 40 },
  },
];
