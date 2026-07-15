export interface ProfileTypes {
  name: string;
  label: string;
  summary: string;
  image: string | null;
  email: string;
  phone: string;
  url: string;
  profiles: { network: string; username: string; url: string }[];
  location?: { city?: string; region?: string; country?: string };
  stats?: { value: string; label: string; color?: string }[];
}
