import { z } from 'zod';
import { connectMongo } from '@/lib/mongodb';
import {
  ContactFormModel,
  type ContactLeadSource,
  type ContactFormRecord,
} from '@/models/ContactForm';

const optionalTrimmed = z.preprocess(value => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().max(200).optional());

export const contactFormSchema = z.object({
  fname: z.string().trim().min(2, 'First name is required').max(60),
  lname: z.string().trim().min(2, 'Last name is required').max(60),
  email: z.string().trim().email('Invalid email address').max(120),
  phone: z.string().trim().min(7, 'Phone number is required').max(30),
  serviceInterested: optionalTrimmed,
  projectType: z.preprocess(
    value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.enum(['New build', 'Redesign', 'Feature extension', 'Bug fixing']).optional()
  ),
  budgetRange: z.preprocess(
    value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.enum(['Under 1k', '1k - 3k', '3k - 7k', '7k+']).optional()
  ),
  desiredTimeline: z.preprocess(
    value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.enum(['ASAP', '2-4 weeks', '1-2 months', 'Flexible']).optional()
  ),
  projectReference: optionalTrimmed,
  pagePath: optionalTrimmed,
  utmSource: optionalTrimmed,
  utmMedium: optionalTrimmed,
  utmCampaign: optionalTrimmed,
  leadSource: z.enum(['home', 'service-detail', 'portfolio-detail', 'contact', 'other']).optional(),
  message: z.string().trim().min(20, 'Please add more project details').max(5000),
  website: z.preprocess(
    value => (typeof value === 'string' ? value.trim() : ''),
    z.string().optional()
  ),
});

function scoreLead(input: {
  budgetRange?: string;
  desiredTimeline?: string;
  projectType?: string;
  message: string;
  serviceInterested?: string;
  leadSource?: ContactLeadSource;
  utmSource?: string;
}) {
  let score = 25;

  const budgetPoints: Record<string, number> = {
    'Under 1k': 4,
    '1k - 3k': 10,
    '3k - 7k': 18,
    '7k+': 25,
  };
  const timelinePoints: Record<string, number> = {
    ASAP: 6,
    '2-4 weeks': 10,
    '1-2 months': 8,
    Flexible: 12,
  };
  const projectTypePoints: Record<string, number> = {
    'New build': 15,
    Redesign: 9,
    'Feature extension': 11,
    'Bug fixing': 5,
  };
  const sourcePoints: Record<string, number> = {
    home: 4,
    'service-detail': 10,
    'portfolio-detail': 12,
    contact: 6,
    other: 2,
  };

  score += budgetPoints[input.budgetRange || ''] || 0;
  score += timelinePoints[input.desiredTimeline || ''] || 0;
  score += projectTypePoints[input.projectType || ''] || 0;
  score += sourcePoints[input.leadSource || 'other'] || 0;
  score += input.serviceInterested ? 8 : 0;
  score += input.utmSource ? 3 : 0;

  if (input.message.length >= 160) score += 15;
  else if (input.message.length >= 80) score += 9;
  else if (input.message.length >= 40) score += 4;

  const normalized = Math.max(0, Math.min(score, 100));
  const band = normalized >= 75 ? 'High' : normalized >= 50 ? 'Medium' : 'Low';
  const priority = normalized >= 75 ? 'P1' : normalized >= 50 ? 'P2' : 'P3';

  return { score: normalized, band, priority };
}

function buildQualificationMessage(input: {
  message: string;
  serviceInterested?: string;
  projectType?: string;
  budgetRange?: string;
  desiredTimeline?: string;
  projectReference?: string;
  pagePath?: string;
  leadSource?: ContactLeadSource;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  leadQuality: { score: number; band: string; priority: string };
}) {
  const qualificationRows = [
    input.serviceInterested ? `Service: ${input.serviceInterested}` : '',
    input.projectType ? `Project Type: ${input.projectType}` : '',
    input.budgetRange ? `Budget: ${input.budgetRange}` : '',
    input.desiredTimeline ? `Timeline: ${input.desiredTimeline}` : '',
    input.projectReference ? `Project Reference: ${input.projectReference}` : '',
    input.pagePath ? `Page Path: ${input.pagePath}` : '',
    input.leadSource ? `Lead Source: ${input.leadSource}` : '',
    input.utmSource ? `UTM Source: ${input.utmSource}` : '',
    input.utmMedium ? `UTM Medium: ${input.utmMedium}` : '',
    input.utmCampaign ? `UTM Campaign: ${input.utmCampaign}` : '',
    `Lead Score: ${input.leadQuality.score}/100 (${input.leadQuality.band})`,
    `Lead Priority: ${input.leadQuality.priority}`,
    `Submitted At (UTC): ${new Date().toISOString()}`,
  ].filter(Boolean);

  return qualificationRows.length > 0
    ? `${input.message}\n\n---\nLead Qualification\n${qualificationRows.join('\n')}`
    : input.message;
}

function mapContactFormRecord(record: ContactFormRecord & { _id?: unknown }) {
  return {
    id:
      typeof record._id === 'object' && record._id && 'toString' in record._id
        ? String(record._id)
        : String(record._id || ''),
    created_at: record.created_at,
    fname: record.fname,
    lname: record.lname,
    email: record.email,
    phone: record.phone,
    message: record.message,
    service_interested: record.service_interested ?? null,
    project_type: record.project_type ?? null,
    budget_range: record.budget_range ?? null,
    desired_timeline: record.desired_timeline ?? null,
    project_reference: record.project_reference ?? null,
    page_path: record.page_path ?? null,
    lead_source: record.lead_source ?? null,
    lead_score: record.lead_score ?? null,
    lead_band: record.lead_band ?? null,
    lead_priority: record.lead_priority ?? null,
    utm_source: record.utm_source ?? null,
    utm_medium: record.utm_medium ?? null,
    utm_campaign: record.utm_campaign ?? null,
  };
}

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LeadQueryFilters = {
  priority: string;
  source: string;
  page: number;
  pageSize: number;
};

export async function submitContactForm(formData: {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  serviceInterested?: string;
  projectType?: string;
  budgetRange?: string;
  desiredTimeline?: string;
  projectReference?: string;
  pagePath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  leadSource?: ContactLeadSource;
  website?: string;
  message: string;
}) {
  try {
    const validationResult = contactFormSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues[0]?.message || 'Validation failed',
        errors: validationResult.error.issues,
      };
    }

    const {
      fname,
      lname,
      email,
      phone,
      message,
      serviceInterested,
      projectType,
      budgetRange,
      desiredTimeline,
      projectReference,
      pagePath,
      utmSource,
      utmMedium,
      utmCampaign,
      leadSource,
      website,
    } = validationResult.data;

    if (typeof website === 'string' && website.length > 0) {
      return { success: false, message: 'Invalid submission.' };
    }

    await connectMongo();

    const leadQuality = scoreLead({
      budgetRange,
      desiredTimeline,
      projectType,
      message,
      serviceInterested,
      leadSource,
      utmSource,
    });

    const enrichedMessage = buildQualificationMessage({
      message,
      serviceInterested,
      projectType,
      budgetRange,
      desiredTimeline,
      projectReference,
      pagePath,
      leadSource,
      utmSource,
      utmMedium,
      utmCampaign,
      leadQuality,
    });

    const now = new Date().toISOString();

    await ContactFormModel.create({
      fname,
      lname,
      email,
      phone,
      message: enrichedMessage,
      service_interested: serviceInterested || null,
      project_type: projectType || null,
      budget_range: budgetRange || null,
      desired_timeline: desiredTimeline || null,
      project_reference: projectReference || null,
      page_path: pagePath || null,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      lead_source: leadSource || null,
      lead_score: leadQuality.score,
      lead_band: leadQuality.band,
      lead_priority: leadQuality.priority,
      created_at: now,
      submitted_at: now,
    });

    return {
      success: true,
      message: 'Message sent successfully!',
    };
  } catch (error: unknown) {
    console.error('Error processing contact form:', error);
    return {
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined,
    };
  }
}

export async function listContactForms(filters: LeadQueryFilters) {
  await connectMongo();

  const query: Record<string, string> = {};

  if (filters.priority !== 'all') {
    query.lead_priority = filters.priority;
  }
  if (filters.source !== 'all') {
    query.lead_source = filters.source;
  }

  const from = (filters.page - 1) * filters.pageSize;
  // const to = from + filters.pageSize;

  const [rows, totalCount] = await Promise.all([
    ContactFormModel.find(query)
      .sort({ lead_priority: 1, created_at: -1 })
      .skip(from)
      .limit(filters.pageSize)
      .lean(),
    ContactFormModel.countDocuments(query),
  ]);

  return {
    rows: rows.map(mapContactFormRecord),
    totalCount,
  };
}

export async function exportContactForms(filters: Omit<LeadQueryFilters, 'page' | 'pageSize'>) {
  await connectMongo();

  const query: Record<string, string> = {};

  if (filters.priority !== 'all') {
    query.lead_priority = filters.priority;
  }
  if (filters.source !== 'all') {
    query.lead_source = filters.source;
  }

  const rows = await ContactFormModel.find(query)
    .sort({ lead_priority: 1, created_at: -1 })
    .limit(2000)
    .lean();

  return rows.map(mapContactFormRecord);
}
