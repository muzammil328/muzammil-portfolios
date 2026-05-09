import { z } from 'zod';
import { connectMongo } from '@/lib/mongodb';
import {
  ResumeModel,
  type ResumeRecord,
  type ResumeWork,
  type ResumeEducation,
  type ResumeSkill,
  type ResumeProject,
} from '@/models/Resume';

const resumeBaseSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  countryCode: z.string().optional().or(z.literal('')),
  summary: z.string().optional().or(z.literal('')),
  label: z.string().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
});

const resumeWorkSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  url: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const resumeEducationSchema = z.object({
  institution: z.string().optional(),
  url: z.string().optional(),
  area: z.string().optional(),
  studyType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).optional(),
});

const resumeSkillSchema = z.object({
  name: z.string().optional(),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

const resumeProjectSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
});

const createResumeSchema = resumeBaseSchema.extend({
  work: z.array(resumeWorkSchema).optional().default([]),
  education: z.array(resumeEducationSchema).optional().default([]),
  skills: z.array(resumeSkillSchema).optional().default([]),
  projects: z.array(resumeProjectSchema).optional().default([]),
});

const updateResumeSchema = resumeBaseSchema
  .partial()
  .extend({
    work: z.array(resumeWorkSchema).optional(),
    education: z.array(resumeEducationSchema).optional(),
    skills: z.array(resumeSkillSchema).optional(),
    projects: z.array(resumeProjectSchema).optional(),
  })
  .refine(payload => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  });

function toResumeResponse(record: ResumeRecord & { _id?: unknown }) {
  return {
    id:
      typeof record._id === 'object' && record._id && 'toString' in record._id
        ? String(record._id)
        : String(record._id || ''),
    userId: record.user_id,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    address: record.address,
    city: record.city,
    countryCode: record.countryCode,
    summary: record.summary,
    label: record.label,
    url: record.url,
    work: record.work,
    education: record.education,
    skills: record.skills,
    projects: record.projects,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function listResumes(userId?: string, isAdmin?: boolean) {
  await connectMongo();

  const filter = isAdmin ? {} : userId ? { user_id: userId } : {};
  const resumes = await ResumeModel.find(filter).sort({ createdAt: -1 }).lean();
  return resumes.map(resume => toResumeResponse(resume));
}

export async function createResume(payload: unknown, userId: string) {
  const parsed = createResumeSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid resume payload');
  }

  await connectMongo();

  const now = new Date().toISOString();
  const data = parsed.data;

  const created = await ResumeModel.create({
    user_id: userId,
    fullName: data.fullName || 'Untitled',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    countryCode: data.countryCode || '',
    summary: data.summary || '',
    label: data.label || '',
    url: data.url || '',
    work: data.work || [],
    education: data.education || [],
    skills: data.skills || [],
    projects: data.projects || [],
    createdAt: now,
    updatedAt: now,
  });

  const lean = created.toObject();
  return toResumeResponse(lean);
}

export async function getResumeById(resumeId: string, userId?: string, isAdmin?: boolean) {
  await connectMongo();

  const filter: Record<string, unknown> = { _id: resumeId };
  if (!isAdmin && userId) {
    filter.user_id = userId;
  }

  const resume = await ResumeModel.findOne(filter).lean().exec();
  if (!resume) {
    throw new Error('Resume not found');
  }

  return toResumeResponse(resume);
}

export async function updateResume(
  resumeId: string,
  payload: unknown,
  userId?: string,
  isAdmin?: boolean
) {
  const parsed = updateResumeSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid update payload');
  }

  await connectMongo();

  const filter: Record<string, unknown> = { _id: resumeId };
  if (!isAdmin && userId) {
    filter.user_id = userId;
  }

  const existing = await ResumeModel.findOne(filter).lean().exec();
  if (!existing) {
    throw new Error('Resume not found');
  }

  const update: Partial<ResumeRecord> = {
    updatedAt: new Date().toISOString(),
  };

  const data = parsed.data;
  if (data.fullName !== undefined) update.fullName = data.fullName;
  if (data.email !== undefined) update.email = data.email;
  if (data.phone !== undefined) update.phone = data.phone;
  if (data.address !== undefined) update.address = data.address;
  if (data.city !== undefined) update.city = data.city;
  if (data.countryCode !== undefined) update.countryCode = data.countryCode;
  if (data.summary !== undefined) update.summary = data.summary;
  if (data.label !== undefined) update.label = data.label;
  if (data.url !== undefined) update.url = data.url;
  if (data.work !== undefined) update.work = data.work as ResumeWork[];
  if (data.education !== undefined) update.education = data.education as ResumeEducation[];
  if (data.skills !== undefined) update.skills = data.skills as ResumeSkill[];
  if (data.projects !== undefined) update.projects = data.projects as ResumeProject[];

  const updated = await ResumeModel.findByIdAndUpdate(resumeId, { $set: update }, { new: true })
    .lean()
    .exec();

  if (!updated) {
    throw new Error('Resume not found');
  }

  return toResumeResponse(updated);
}

export async function deleteResume(resumeId: string, userId?: string, isAdmin?: boolean) {
  await connectMongo();

  const filter: Record<string, unknown> = { _id: resumeId };
  if (!isAdmin && userId) {
    filter.user_id = userId;
  }

  const deleted = await ResumeModel.findOneAndDelete(filter).lean().exec();

  if (!deleted) {
    throw new Error('Resume not found');
  }

  return { id: resumeId };
}
