import { client } from '../../sanity/lib/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const _dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export interface PortfolioProfile {
  name: string;
  label: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  image: any;
  location: { city: string; region: string; country: string };
  profiles: { network: string; username: string; url: string }[];
  stats: { value: string; label: string }[];
}

export interface Project {
  _id: string;
  title: string;
  mainImage: any;
  sliderImages: any[];
  description: string;
  liveLink: string;
  githubLink: string;
  figmaDesign: string;
  skills: string[];
  body: any;
}

export interface Skill {
  _id: string;
  name: string;
  type: string;
  news: boolean;
  description: string;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  isCurrent: boolean;
  endDate: string;
  location: { city: string; country: string };
  summary: string;
  highlights: string[];
}

export interface Education {
  _id: string;
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface SanityData {
  portfolio: PortfolioProfile | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
}

function fmt(val: any, fallback = '—'): string {
  if (val === null || val === undefined) return fallback;

  // Primitive types
  if (typeof val === 'string') {
    const s = val.trim();
    return s === '' ? fallback : s;
  }
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);

  // Arrays: format each item recursively
  if (Array.isArray(val)) {
    const parts = val.map((item) => fmt(item, '')).filter((p) => p !== '');
    if (parts.length === 0) return fallback;
    const joined = parts.join(', ');
    return joined.length ? joined : fallback;
  }

  // Objects: try to extract a human-friendly field
  if (typeof val === 'object') {
    // Sanity portable text block
    if (val._type === 'block' && Array.isArray(val.children)) {
      const txt = val.children.map((c: any) => c.text || '').join('').trim();
      return txt || fallback;
    }

    // If object has a children array of inline texts
    if (Array.isArray(val.children)) {
      const txt = val.children.map((c: any) => c.text || fmt(c, '')).join(' ').trim();
      if (txt) return txt;
    }

    // Common candidate fields
    const candidateKeys = ['title', 'name', 'label', 'value', 'text', 'heading', 'description', 'role'];
    for (const k of candidateKeys) {
      if (val[k]) return fmt(val[k], fallback);
    }

    // Shallow stringify useful scalar properties
    try {
      const simple = Object.values(val)
        .map((v: any) => (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? String(v) : ''))
        .filter(Boolean);
      if (simple.length) {
        const joined = simple.join(', ');
        return joined.length ? joined : fallback;
      }
    } catch (e) {
      // ignore
    }

    // Final fallback: JSON truncated
    try {
      const json = JSON.stringify(val);
      if (!json || json === '{}') return fallback;
      return json.length > 200 ? json.slice(0, 197) + '...' : json;
    } catch (e) {
      return fallback;
    }
  }

  return String(val);
}

function fmtBool(val: boolean | undefined | null): string {
  return val ? 'Yes' : 'No';
}

function generateMarkdown(data: SanityData): string {
  const { portfolio, projects, skills, experiences, education } = data;
  const lines: string[] = [];

  lines.push(`# Sanity CMS — Full Data Export`);
  lines.push(``);
  lines.push(`> Generated on ${new Date().toISOString().replace('T', ' ').slice(0, 19)}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // ── 1. Portfolio / Profile ──
  lines.push(`## 1. Portfolio / Profile`);
  lines.push(``);
  if (portfolio) {
    lines.push(`| Field | Value |`);
    lines.push(`|-------|-------|`);
    lines.push(`| Name | ${fmt(portfolio.name)} |`);
    lines.push(`| Title / Role | ${fmt(portfolio.label)} |`);
    lines.push(`| Email | ${fmt(portfolio.email)} |`);
    lines.push(`| Phone | ${fmt(portfolio.phone)} |`);
    lines.push(`| Website | ${fmt(portfolio.url)} |`);
    lines.push(`| Location | ${portfolio.location ? `${fmt(portfolio.location.city)}, ${fmt(portfolio.location.region)}, ${fmt(portfolio.location.country)}` : '—'} |`);
    lines.push(`| Summary | ${fmt(portfolio.summary)} |`);
    lines.push(``);

    if (portfolio.profiles && portfolio.profiles.length > 0) {
      lines.push(`### Social Profiles`);
      lines.push(``);
      lines.push(`| Network | Username | URL |`);
      lines.push(`|---------|----------|-----|`);
      for (const p of portfolio.profiles) {
        lines.push(`| ${fmt(p.network)} | ${fmt(p.username)} | ${fmt(p.url)} |`);
      }
      lines.push(``);
    }

    if (portfolio.stats && portfolio.stats.length > 0) {
      lines.push(`### Stats`);
      lines.push(``);
      for (const s of portfolio.stats) {
        lines.push(`- **${s.value}** — ${s.label}`);
      }
      lines.push(``);
    }
  } else {
    lines.push(`*No portfolio data found.*`);
    lines.push(``);
  }
  lines.push(`---`);
  lines.push(``);

  // ── 2. Projects ──
  lines.push(`## 2. Projects (${projects.length})`);
  lines.push(``);
  if (projects.length > 0) {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      lines.push(`### ${i + 1}. ${p.title}`);
      lines.push(``);
      lines.push(`| Field | Value |`);
      lines.push(`|-------|-------|`);
      lines.push(`| Skills | ${p.skills?.length ? p.skills.join(', ') : '—'} |`);
      lines.push(`| Description | ${fmt(p.description)} |`);
      lines.push(`| Live Link | ${p.liveLink ? `[Link](${p.liveLink})` : '—'} |`);
      lines.push(`| GitHub Link | ${p.githubLink ? `[Link](${p.githubLink})` : '—'} |`);
      lines.push(`| Figma Design | ${p.figmaDesign ? `[Link](${p.figmaDesign})` : '—'} |`);
      lines.push(`| Body | ${fmt(p.body)} |`);
      lines.push(``);
    }
  } else {
    lines.push(`*No projects found.*`);
    lines.push(``);
  }
  lines.push(`---`);
  lines.push(``);

  // ── 3. Skills ──
  lines.push(`## 3. Skills (${skills.length})`);
  lines.push(``);
  if (skills.length > 0) {
    const grouped: Record<string, Skill[]> = {};
    for (const s of skills) {
      const t = s.type || 'other';
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(s);
    }
    for (const [typeName, items] of Object.entries(grouped)) {
      lines.push(`### ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}`);
      lines.push(``);
      lines.push(`| Name | Description | New |`);
      lines.push(`|------|-------------|-----|`);
      for (const s of items) {
        lines.push(`| ${s.name} | ${fmt(s.description)} | ${fmtBool(s.news)} |`);
      }
      lines.push(``);
    }
  } else {
    lines.push(`*No skills found.*`);
    lines.push(``);
  }
  lines.push(`---`);
  lines.push(``);

  // ── 4. Work Experience ──
  lines.push(`## 4. Work Experience (${experiences.length})`);
  lines.push(``);
  if (experiences.length > 0) {
    for (let i = 0; i < experiences.length; i++) {
      const e = experiences[i];
      lines.push(`### ${i + 1}. ${e.position} @ ${e.company}`);
      lines.push(``);
      lines.push(`| Field | Value |`);
      lines.push(`|-------|-------|`);
      lines.push(`| Company | ${fmt(e.company)} |`);
      lines.push(`| Position | ${fmt(e.position)} |`);
      lines.push(`| Location | ${e.location ? `${fmt(e.location.city)}, ${fmt(e.location.country)}` : '—'} |`);
      lines.push(`| Start Date | ${fmt(e.startDate)} |`);
      lines.push(`| End Date | ${e.isCurrent ? 'Present' : fmt(e.endDate)} |`);
      lines.push(`| Current | ${fmtBool(e.isCurrent)} |`);
      lines.push(`| Summary | ${fmt(e.summary)} |`);
      lines.push(`| Highlights | ${e.highlights?.length ? e.highlights.map((h) => `\`${h}\``).join(', ') : '—'} |`);
      lines.push(``);
    }
  } else {
    lines.push(`*No work experience found.*`);
    lines.push(``);
  }
  lines.push(`---`);
  lines.push(``);

  // ── 5. Education ──
  lines.push(`## 5. Education (${education.length})`);
  lines.push(``);
  if (education.length > 0) {
    lines.push(`| # | Institution | Area | Degree | Start | End | Score |`);
    lines.push(`|---|-------------|------|--------|-------|-----|-------|`);
    for (let i = 0; i < education.length; i++) {
      const e = education[i];
      lines.push(`| ${i + 1} | ${fmt(e.institution)} | ${fmt(e.area)} | ${fmt(e.studyType)} | ${fmt(e.startDate)} | ${fmt(e.endDate)} | ${fmt(e.score)} |`);
    }
    lines.push(``);
  } else {
    lines.push(`*No education found.*`);
    lines.push(``);
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(`*Export complete.*`);

  return lines.join('\n');
}

async function main() {
  console.log('Fetching all data from Sanity...');
  const data = await getAllSanityData();
  console.log('Data fetched successfully.');
  console.log(`  Portfolio: ${data.portfolio ? 'Yes' : 'No'}`);
  console.log(`  Projects: ${data.projects.length}`);
  console.log(`  Skills: ${data.skills.length}`);
  console.log(`  Experiences: ${data.experiences.length}`);
  console.log(`  Education: ${data.education.length}`);

  const md = generateMarkdown(data);
  const outputPath = path.resolve(_dirname, 'readme.md');
  fs.writeFileSync(outputPath, md, 'utf-8');
  console.log(`\nOutput written to: ${outputPath}`);
}

export async function getAllSanityData(): Promise<SanityData> {
  const [portfolio, projects, skills, experiences, education] =
    await Promise.all([
      client.fetch(`*[_type == "portfolio"][0]{
        name,
        label,
        email,
        phone,
        url,
        summary,
        image,
        location { city, region, country },
        profiles[]{ network, username, url },
        stats[]{ value, label }
      }`),
      client.fetch(`*[_type == "project"] | order(priority asc) {
        _id,
        title,
        mainImage,
        sliderImages,
        description,
        liveLink,
        githubLink,
        figmaDesign,
        "skills": skills[]->name,
        body
      }`),
      client.fetch(`*[_type == "skills"] | order(name asc) {
        _id,
        name,
        type,
        news,
        description
      }`),
      client.fetch(`*[_type == "experience"] | order(startDate desc) {
        _id,
        company,
        position,
        startDate,
        isCurrent,
        endDate,
        location { city, country },
        summary,
        highlights
      }`),
      client.fetch(`*[_type == "education"] | order(startDate desc) {
        _id,
        institution,
        area,
        studyType,
        startDate,
        endDate,
        score
      }`),
    ]);

  return { portfolio, projects, skills, experiences, education };
}

const isMainModule = process.argv[1]?.endsWith('sanityData.ts');
if (isMainModule) {
  main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}
