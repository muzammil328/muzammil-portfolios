export interface AnalysisFactor {
  factor: string;
  jobRequirement: string;
  myValue: string;
  qualify: boolean;
}

export interface SummarySuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

export interface SkillsSuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

export interface ExperienceSuggestion {
  workIndex: number;
  keywords: string[];
}

export interface ResumeProfile {
  network: string;
  username: string;
  url: string;
}

export interface ResumeLocation {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface ResumeBasics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: ResumeLocation;
  profiles: ResumeProfile[];
}

export interface ResumeWork {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface ResumeEducation {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
}

export interface ResumeSkill {
  name: string;
  level: string;
  keywords: string[];
}

export interface ResumeProject {
  name: string;
  url: string;
  keywords: string[];
  highlights: string[];
}

export interface ResumeVolunteer {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface ResumeAward {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  work: ResumeWork[];
  volunteer: ResumeVolunteer[];
  education: ResumeEducation[];
  awards: ResumeAward[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
}

export const defaultResumeData: ResumeData = {
  basics: {
    name: 'Your Name',
    label: 'Software Engineer',
    image: '',
    email: 'email@example.com',
    phone: '(555) 123-4567',
    url: 'https://portfolio.com',
    summary: 'Experienced software engineer with a focus on building scalable web applications.',
    location: {
      address: '',
      postalCode: '',
      city: 'San Francisco',
      countryCode: 'US',
      region: 'CA',
    },
    profiles: [
      { network: 'LinkedIn', username: 'username', url: 'https://linkedin.com/in/username' },
      { network: 'GitHub', username: 'username', url: 'https://github.com/username' },
    ],
  },
  work: [
    {
      name: 'Company Name',
      position: 'Senior Developer',
      url: '',
      startDate: '2020-01',
      endDate: 'Present',
      summary: '',
      highlights: ['Led development of key features.', 'Improved performance by 50%.'],
    },
  ],
  volunteer: [],
  education: [
    {
      institution: 'University Name',
      url: '',
      area: 'Computer Science',
      studyType: 'Bachelor',
      startDate: '2015-09',
      endDate: '2019-05',
      score: '3.8',
      courses: [],
    },
  ],
  awards: [],
  skills: [
    { name: 'Languages', level: '', keywords: ['JavaScript', 'TypeScript', 'Python', 'Go'] },
    { name: 'Frameworks', level: '', keywords: ['React', 'Next.js', 'Node.js', 'Express'] },
    { name: 'Tools', level: '', keywords: ['Git', 'Docker', 'AWS', 'Linux'] },
  ],
  projects: [
    {
      name: 'Project Name',
      url: 'https://project.com',
      keywords: ['React', 'Node.js'],
      highlights: ['Built a full-stack application', 'Used modern technologies'],
    },
  ],
};
