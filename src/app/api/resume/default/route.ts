import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getProfile, getSkillItems } from '@/sanity/lib/portfolio';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const [profile, workData, skillItems, educationData, personalProjectsData] = await Promise.all([
      getProfile(),
      client.fetch(`
        *[_type == "experience"] | order(startDate desc) {
          _id,
          company,
          companyUrl,
          position,
          startDate,
          isCurrent,
          endDate,
          summary,
          highlights,
          "projects": *[_type == "project" && references(^._id)] | order(priority asc) {
            title,
            liveLink,
            githubLink,
            features,
            "techStack": skills[]->name
          }
        }
      `),
      getSkillItems(),
      client.fetch(`
        *[_type == "portfolio"][0].education[]->{
          institution, area, studyType, startDate, endDate, score
        }
      `),
      client.fetch(`
        *[_type == "project" && !defined(company)] | order(priority asc) {
          title,
          liveLink,
          githubLink,
          features,
          "techStack": skills[]->name
        }
      `),
    ]);

    if (!profile) {
      return NextResponse.json({
        basics: {
          name: 'Your Name',
          label: 'Job Title',
          email: '',
          phone: '',
          url: '',
          summary: '',
          location: { address: '', postalCode: '', city: '', countryCode: '', region: '' },
          profiles: [],
        },
        work: [],
        education: [],
        skills: [],
        projects: [],
        personalProjects: [],
      });
    }

    const resumeData = {
      basics: {
        name: profile?.name || 'Your Name',
        label: profile?.label || 'Job Title',
        email: profile?.email || '',
        phone: profile?.phone || '',
        url: profile?.url || '',
        summary: profile?.summary || '',
        location: {
          address: '',
          postalCode: '',
          city: profile?.location?.city || '',
          countryCode: '',
          region: profile?.location?.region || '',
        },
        profiles:
          profile?.profiles?.map((p: { network: string; username: string; url: string }) => ({
            network: p.network,
            username: p.username || '',
            url: p.url || '',
          })) || [],
      },
      work: (workData || [])
        .map(
          (job: {
            company?: string;
            position?: string;
            companyUrl?: string;
            startDate?: string;
            isCurrent?: boolean;
            endDate?: string;
            summary?: string;
            highlights?: string[];
            projects?: {
              title?: string;
              liveLink?: string;
              githubLink?: string;
              features?: string[];
              techStack?: string[];
            }[];
          }) => ({
            name: job?.company || '',
            position: job?.position || '',
            url: job?.companyUrl || '',
            startDate: job?.startDate?.slice(0, 7) || '',
            endDate: job?.isCurrent ? 'Present' : job?.endDate?.slice(0, 7) || '',
            summary: job?.summary || '',
            highlights: job?.highlights || [],
            projects: (job?.projects || []).map(p => ({
              name: p?.title || '',
              url: p?.liveLink || p?.githubLink || '',
              techStack: (p?.techStack || []).filter(Boolean),
              highlights: p?.features || [],
            })),
          })
        )
        .filter((job: { name: string; position: string }) => job.name || job.position),
      education: (educationData || [])
        .map(
          (edu: {
            institution?: string;
            area?: string;
            studyType?: string;
            startDate?: string;
            endDate?: string;
            score?: string;
          }) => ({
            institution: edu?.institution || '',
            url: '',
            area: edu?.area || '',
            studyType: edu?.studyType || '',
            startDate: edu?.startDate?.slice(0, 7) || '',
            endDate: edu?.endDate?.slice(0, 7) || '',
            score: edu?.score || '',
            courses: [],
          })
        )
        .filter(
          (edu: { institution: string; studyType: string }) => edu.institution || edu.studyType
        ),
      skills: (skillItems || []).reduce(
        (acc: { name: string; keywords: string[] }[], skill: { type?: string; name?: string }) => {
          if (!skill?.type || !skill?.name) return acc;
          const existing = acc.find(s => s.name === skill.type);
          if (existing) {
            existing.keywords.push(skill.name);
          } else {
            acc.push({ name: skill.type, keywords: [skill.name] });
          }
          return acc;
        },
        []
      ),
      personalProjects: (personalProjectsData || []).map(
        (proj: {
          title?: string;
          liveLink?: string;
          githubLink?: string;
          features?: string[];
          techStack?: string[];
        }) => ({
          name: proj?.title || '',
          url: proj?.liveLink || proj?.githubLink || '',
          techStack: (proj?.techStack || []).filter(Boolean),
          highlights: proj?.features || [],
        })
      ),
    };

    return NextResponse.json(resumeData);
  } catch (error: unknown) {
    console.error('Failed to fetch default resume from Sanity:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to fetch default resume', error: errorMessage },
      { status: 500 }
    );
  }
}
