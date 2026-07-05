import { SanitySlugType, SanityImageType } from '@muzammil328/sanity';

export interface ServiceTypes {
  _id: string;
  name: string;
  slug: SanitySlugType;
  image: SanityImageType;
  summary?: string;
  focus: { title: string; description?: string; icon?: string }[];
  deliverables?: { title: string; description?: string; icon?: string }[];
  processSteps?: {
    title: string;
    description?: string;
  }[];
  idealClient?: string[];
  timeline?: string;
  pricing?: {
    model?: 'fixed' | 'hourly' | 'retainer';
    startingAt?: number;
    currency?: string;
  };
  isFeatured?: boolean;
  proofPoints?: {
    label?: string;
    value?: string;
    iconIdx?: number;
  }[];
  testimonials?: {
    quote?: string;
    author?: string;
    role?: string;
  }[];
  skills: {
    name: string;
    icon: SanityImageType;
    color?: string;
    proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsUsed?: number;
    featured?: boolean;
  }[];
}

export type ContactLeadSource =
  | 'home'
  | 'service-detail'
  | 'portfolio-detail'
  | 'contact'
  | 'other';
