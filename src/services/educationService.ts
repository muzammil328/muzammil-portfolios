import educationData from '@/data/education.json';
import { EducationItem } from '@/types/Education';

export async function getEducationList(): Promise<EducationItem[]> {
  return [...educationData].sort(
    (a, b) => new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime(),
  );
}
