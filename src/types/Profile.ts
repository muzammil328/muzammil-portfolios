import { SanityImageType } from '@muzammil328/sanity';

export interface ProfileTypes {
  name: string;
  label: string;
  summary: string;
  image: SanityImageType;
  email: string;
  phone: string;
  url: string;
  profiles: { network: string; username: string; url: string }[];
}
