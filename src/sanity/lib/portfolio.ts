import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '@/sanity/env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export async function getProfile() {
  return client.fetch(`*[_type == "portfolio"][0]{
    name,
    label,
    email,
    phone,
    url,
    summary,
    image,
    location {
      city,
      region,
      country
    },
    "profiles": profiles[]{ network, username, url }
  }`);
}

export async function getProjectBySlug(slug: string) {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    mainImage,
    "sliderImages": sliderImages[]{ asset },
    description,
    role,
    duration,
    teamSize,
    liveLink,
    githubLink,
    figmaDesign,
    "category": category->name,
    "skills": skills[]->name,
    body
  }`,
    { slug }
  );
}

export async function getSkillCategories() {
  return client.fetch(`*[_type == "skillCategory"]`);
}

export async function getEducation() {
  // Education is now fetched in getWorkExperiences
  return [];
}

export async function getSkillItems() {
  return client.fetch(`*[_type == "skills"]{
    type,
    name,
    description
  }`);
}

export async function getProjects() {
  return client.fetch(`*[_type == "project"] | order(priority asc) {
    _id,
    title,
    slug,
    mainImage,
    description,
    liveLink,
    githubLink,
    role,
    "category": category->name,
    "skills": skills[]->name
  }`);
}

export async function getServices() {
  return client.fetch(`*[_type == "service"] | order(_createdAt asc) {
    _id,
    name,
    slug,
    summary,
    "skills": skills[]->{
  name,
  icon
},
    focus,
    deliverables,
    processSteps,
    idealClient,
    timeline,
    pricing,
    isFeatured
  }`);
}

export async function getWorkExperiences() {
  // Get experiences directly from experience type
  const experiences = await client.fetch(`*[_type == "experience"] | order(startDate desc){
    company,
    companyUrl,
    position,
    startDate,
    isCurrent,
    endDate,
    summary,
    highlights
  }`);

  console.log('Direct experience fetch:', experiences?.length, 'experiences');

  // Also check portfolio for education
  const portfolioEducation = await client.fetch(`*[_type == "portfolio"][0].education[]->{
    institution,
    area,
    studyType,
    startDate,
    endDate,
    score
  }`);

  return { work: experiences || [], education: portfolioEducation || [] };
}

export async function getAllPortfolioData() {
  const [profile, skillCategories, workExperiences, education, skillItems, projects] =
    await Promise.all([
      getProfile(),
      getSkillCategories(),
      getWorkExperiences(),
      getEducation(),
      getSkillItems(),
      getProjects(),
    ]);

  return {
    profile,
    skillCategories,
    workExperiences,
    education,
    skillItems,
    projects,
  };
}

