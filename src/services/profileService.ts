import profileData from '@/data/profile.json';
import { ProfileTypes } from '@/types/Profile';

export async function fetchProfile(): Promise<ProfileTypes> {
  return profileData as ProfileTypes;
}
