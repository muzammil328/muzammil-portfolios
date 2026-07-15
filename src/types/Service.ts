export interface ServiceTypes {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
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
    icon: string | null;
    color?: string | null;
    proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
    yearsUsed?: number | null;
    featured?: boolean | null;
  }[];
}

export type ContactLeadSource =
  | 'home'
  | 'service-detail'
  | 'portfolio-detail'
  | 'contact'
  | 'other';
