export interface ExperienceMilestone {
  title: string;
  type: string;
  description?: string;
  date?: string;
  link?: string;
  images: string[];
}

export interface ExperienceItem {
  _id: string;
  company: string;
  companyUrl?: string;
  position: string;
  slug: string;
  image: string | null;
  isVisible?: boolean;
  isCurrent?: boolean;
  location?: { city?: string; country?: string };
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights: string[];
  milestones: ExperienceMilestone[];
}
