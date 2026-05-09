'use server';

import { submitContactForm as submitContactFormHelper } from '@/lib/contactForms';

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
  leadSource?: 'home' | 'service-detail' | 'portfolio-detail' | 'contact' | 'other';
  website?: string;
  message: string;
}) {
  return submitContactFormHelper(formData);
}
