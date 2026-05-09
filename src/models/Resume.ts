import mongoose, { Schema, type Model } from 'mongoose';

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

export interface ResumeAward {
  title: string;
  date: string;
  awarder: string;
  summary: string;
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

export interface ResumeRecord {
  user_id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  countryCode: string;
  summary: string;
  label: string;
  url: string;
  basics?: ResumeBasics;
  work: ResumeWork[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  awards: ResumeAward[];
  volunteer: ResumeVolunteer[];
  createdAt: string;
  updatedAt: string;
}

const ResumeSchema = new Schema<ResumeRecord>(
  {
    user_id: { type: String, required: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, maxlength: 255 },
    phone: { type: String, trim: true, maxlength: 50 },
    address: { type: String, trim: true, maxlength: 255 },
    city: { type: String, trim: true, maxlength: 100 },
    countryCode: { type: String, trim: true, maxlength: 10 },
    summary: { type: String, maxlength: 1000 },
    label: { type: String, trim: true, maxlength: 120 },
    url: { type: String, trim: true, maxlength: 500 },
    basics: { type: Object, default: null },
    work: {
      type: [
        {
          name: String,
          position: String,
          url: String,
          startDate: String,
          endDate: String,
          summary: String,
          highlights: [String],
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          institution: String,
          url: String,
          area: String,
          studyType: String,
          startDate: String,
          endDate: String,
          score: String,
          courses: [String],
        },
      ],
      default: [],
    },
    skills: {
      type: [
        {
          name: String,
          level: String,
          keywords: [String],
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          name: String,
          url: String,
          keywords: [String],
          highlights: [String],
        },
      ],
      default: [],
    },
    awards: {
      type: [
        {
          title: String,
          date: String,
          awarder: String,
          summary: String,
        },
      ],
      default: [],
    },
    volunteer: {
      type: [
        {
          organization: String,
          position: String,
          url: String,
          startDate: String,
          endDate: String,
          summary: String,
          highlights: [String],
        },
      ],
      default: [],
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    updatedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    versionKey: false,
    collection: 'resumes',
  }
);

ResumeSchema.index({ user_id: 1, createdAt: -1 });
ResumeSchema.index({ fullName: 'text', summary: 'text' });

export const ResumeModel: Model<ResumeRecord> =
  (mongoose.models.Resume as Model<ResumeRecord>) ||
  mongoose.model<ResumeRecord>('Resume', ResumeSchema);
