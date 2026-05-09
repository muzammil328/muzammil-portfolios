import mongoose, { Schema, type Model } from 'mongoose';

export type ContactLeadSource =
  | 'home'
  | 'service-detail'
  | 'portfolio-detail'
  | 'contact'
  | 'other';

export interface ContactFormRecord {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  message: string;
  service_interested?: string | null;
  project_type?: string | null;
  budget_range?: string | null;
  desired_timeline?: string | null;
  project_reference?: string | null;
  page_path?: string | null;
  lead_source?: ContactLeadSource | null;
  lead_score?: number | null;
  lead_band?: string | null;
  lead_priority?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  created_at: string;
  submitted_at: string;
}

const ContactFormSchema = new Schema<ContactFormRecord>(
  {
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    service_interested: { type: String, default: null },
    project_type: { type: String, default: null },
    budget_range: { type: String, default: null },
    desired_timeline: { type: String, default: null },
    project_reference: { type: String, default: null },
    page_path: { type: String, default: null },
    lead_source: { type: String, default: null },
    lead_score: { type: Number, default: null },
    lead_band: { type: String, default: null },
    lead_priority: { type: String, default: null },
    utm_source: { type: String, default: null },
    utm_medium: { type: String, default: null },
    utm_campaign: { type: String, default: null },
    created_at: {
      type: String,
      default: () => new Date().toISOString(),
    },
    submitted_at: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    versionKey: false,
    collection: 'contact_forms',
  }
);

ContactFormSchema.index({ lead_priority: 1, created_at: -1 });
ContactFormSchema.index({ lead_source: 1, created_at: -1 });
ContactFormSchema.index({ created_at: -1 });

export const ContactFormModel: Model<ContactFormRecord> =
  (mongoose.models.ContactForm as Model<ContactFormRecord>) ||
  mongoose.model<ContactFormRecord>('ContactForm', ContactFormSchema);
