'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { getImageUrl } from '@/sanity/lib/image';
import { PortableTextView } from '@muzammil328/ui';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProjectDetail } from '@/types/Project';
import { SanityImageType } from '@muzammil328/sanity';
import PortfolioCard from '@/components/PortfolioCard';
import PageViewTracker from '@/components/PageViewTracker';
import { CloseIcon, GitHubIcon, ClockIcon, ZoomInIcon } from '@muzammil328/icon';
import { UserIcon, Users, ChevronLeft, ChevronRight } from 'lucide-react';

function Figma() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000"><g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" /><path d="M12 12.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 1 1-7 0zm-7 7A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0zm0-7A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" /></g></svg>
  )
}


const roleMap: Record<string, string> = {
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  fullstack: 'Full Stack Developer',
};

const durationMap: Record<string, string> = {
  'less-1-month': 'Less than 1 month',
  '1-3-months': '1-3 months',
  '3-6-months': '3-6 months',
  '6-12-months': '6-12 months',
  'more-1-year': 'More than 1 year',
  ongoing: 'Ongoing',
};

const teamSizeMap: Record<string, string> = {
  '1': 'Solo',
  '2': '2 People',
  '3-5': '3-5 People',
  '5-10': '5-10 People',
  '10-20': '10-20 People',
  '20+': '20+ People',
};

function getRoleLabel(role?: string): string {
  if (!role) return '';
  return roleMap[role] || role;
}

function getDurationLabel(duration?: string): string {
  if (!duration) return '';
  return durationMap[duration] || duration;
}

function getTeamSizeLabel(teamSize?: string): string {
  if (!teamSize) return '';
  return teamSizeMap[teamSize] || teamSize;
}

interface ProjectSkillItem {
  name: string;
  icon?: SanityImageType;
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-muted rounded-full" />
              <div className="h-12 w-3/4 bg-muted rounded" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-20 bg-muted rounded-full" />
                ))}
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-muted rounded-full" />
                <div className="h-12 w-32 bg-muted rounded-full" />
              </div>
            </div>
            <div className="h-80 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close lightbox"
        className="absolute inset-0"
        onClick={onClose}
      />
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
        onClick={e => {
          e.stopPropagation();
          onPrev();
        }}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <div className="relative max-w-5xl max-h-[90vh] w-full mx-16">
        <Image
          src={images[currentIndex]}
          alt={`Screenshot ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-h-[90vh] w-auto mx-auto object-contain"
        />
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full"
        onClick={e => {
          e.stopPropagation();
          onNext();
        }}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      <button
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

async function fetchProject(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    title,
    mainImage,
    "sliderImages": sliderImages[]{ _key, _type, asset },
    description,
    role,
    duration,
    teamSize,
    liveLink,
    githubLink,
    figmaDesign,
    "category": category->name,
    "company": company->{company, "slug": slug.current},
    "skillNames": skills[]->{ name, icon },
    features,
    "relatedProjects": relatedProjects[]->{
      title,
      slug,
      mainImage,
      description,
      "category": category->name,
      role,
      teamSize,
      duration
    },
    problem,
    solution,
    research,
    myRole,
    techStack,
    outcome,
    takeaways
  }`;
  return client.fetch(query, { slug });
}

export default function PortfolioDetailClient({ slug }: { slug: string }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        const projectData = await fetchProject(slug);

        if (projectData) {
          setProject(projectData);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const projectSections = [
    {
      id: 'problem',
      title: 'Problem',
      content: project?.problem,
    },
    {
      id: 'solution',
      title: 'Solution',
      content: project?.solution,
    },
    {
      id: 'research',
      title: 'Research / Inspiration',
      content: project?.research,
    },
    {
      id: 'myRole',
      title: 'My Role',
      content: project?.myRole,
    },
    {
      id: 'techStack',
      title: 'Tech Stack',
      content: project?.techStack,
    },
    {
      id: 'outcome',
      title: 'Outcome / Results',
      content: project?.outcome,
    },
    {
      id: 'takeaways',
      title: 'Key Takeaways / Learnings',
      content: project?.takeaways,
    },
  ].filter(section => Array.isArray(section.content) && section.content.length > 0);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !project) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || 'Project not found'}</h1>
            <Link href="/portfolio" className="text-primary hover:underline">
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderedSliderImages = (project.sliderImages || [])
    .filter((image): image is SanityImageType => Boolean(image?.asset?._ref))
    .filter((image, index, images) => {
      // Keep first occurrence only to avoid duplicate screenshots in the grid.
      return images.findIndex(candidate => candidate.asset._ref === image.asset._ref) === index;
    });

  const sliderImageUrls = orderedSliderImages
    .map(image => getImageUrl(image, 1200, 800))
    .filter((url): url is string => Boolean(url));
  const projectContactHref = `/contact?${new URLSearchParams({
    service: project.category || 'Project Development',
    project: project.title,
    page: `/portfolio/${slug}`,
    source: 'portfolio-detail',
  }).toString()}`;

  const renderScreenshotTile = (
    imageIndex: number,
    colSpanClass: string,
    width = 1200,
    height = 800
  ) => {
    const image = orderedSliderImages[imageIndex];
    const imageUrl = image ? getImageUrl(image, width, height) : null;

    if (!image || !imageUrl) {
      return (
        <div
          className={`relative aspect-video overflow-hidden rounded-2xl border border-dashed border-border/50 bg-muted/20 ${colSpanClass}`}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            Screenshot coming soon
          </div>
        </div>
      );
    }

    return (
      <button
        key={image._key}
        className={`relative overflow-hidden rounded-2xl group ${colSpanClass}`}
        onClick={() => openLightbox(sliderImageUrls, imageIndex)}
      >
        <Image
          src={imageUrl}
          alt={`Screenshot ${imageIndex + 1}`}
          width={width}
          height={height}
          className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
          <ZoomInIcon />
        </div>
      </button>
    );
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Title, Description, Role, Duration, Category, CTAs */}
            <div className="space-y-4">
              {/* Role, Duration, Team Size, Company */}
              <div className="flex flex-wrap gap-4">
                {project.role && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                    <UserIcon />
                    <span className="text-sm">{getRoleLabel(project.role)}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                    <ClockIcon />
                    <span className="text-sm">{getDurationLabel(project.duration)}</span>
                  </div>
                )}
                {project.teamSize && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                    <Users />
                    <span className="text-sm">{getTeamSizeLabel(project.teamSize)}</span>
                  </div>
                )}
                {project.company?.company && (
                  <Link
                    href={`/experiences/${project.company.slug}`}
                    className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="text-sm">{project.company.company}</span>
                  </Link>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold">{project.title}</h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground">{project.description}</p>
              <PageViewTracker path={`/portfolio/${slug}`} />
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {project.liveLink && project.liveLink !== '/' && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    View Live Demo
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                  </a>
                )}
                {project.figmaDesign && project.figmaDesign !== '/' && (
                  <a
                    href={project.figmaDesign}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 border border-border rounded-full hover:bg-primary/10 transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <Figma />
                    View Design
                  </a>
                )}
                {project.githubLink && project.githubLink !== '/' && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 border border-border rounded-full hover:bg-primary/10 transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <GitHubIcon />
                    View Code
                  </a>
                )}
              </div>

              {/* Right Column - Skills */}
              <div>
                <span className="text-lg font-semibold">Technologies</span>
                <div className="flex flex-wrap gap-3 mt-4">
                  {(project.skillNames as unknown as ProjectSkillItem[] | undefined)?.map(
                    (skill, i: number) => {
                      const iconUrl = skill.icon ? getImageUrl(skill.icon, 32, 32) : null;
                      return (
                        <span
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 bg-secondary/80 text-secondary-foreground rounded-full text-sm border border-border/50 hover:border-primary/50 hover:bg-secondary transition-all"
                        >
                          {iconUrl && (
                            <Image
                              src={iconUrl}
                              alt={skill.name}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          )}
                          {skill.name}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Main Image */}
            <div className="relative w-full rounded-2xl h-full">
              {project.mainImage &&
                (() => {
                  const imageUrl = getImageUrl(project.mainImage, 800);
                  return imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.title}
                      width={800}
                      height={400}
                      className="w-full h-auto object-cover rounded-2xl shadow-lg border border-border/30"
                      priority
                    />
                  ) : null;
                })()}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-bold">Key Features</h2>
        </div>
        <PortableTextView value={project.features || []} />
      </section>

      {/* Project Sections - Plain display */}
      {projectSections.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {projectSections.map((section, index) => (
              <article key={section.id} id={section.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                </div>
                <div className="pl-10">
                  <PortableTextView value={section.content || []} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Slider Images */}
      {orderedSliderImages.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-bold">Project Screenshots</h2>
          </div>

          {orderedSliderImages.length === 1 ? (
            <div className="grid grid-cols-1">{renderScreenshotTile(0, '')}</div>
          ) : orderedSliderImages.length === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {renderScreenshotTile(0, '', 900, 700)}
              {renderScreenshotTile(1, '', 900, 700)}
            </div>
          ) : orderedSliderImages.length < 5 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6 items-start">
              {renderScreenshotTile(0, 'lg:col-span-7', 1200, 760)}
              {renderScreenshotTile(1, 'lg:col-span-5', 960, 760)}
              {orderedSliderImages[2] && renderScreenshotTile(2, 'lg:col-span-5', 960, 760)}
              {orderedSliderImages[3] && renderScreenshotTile(3, 'lg:col-span-7', 1200, 760)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6 items-start">
              {renderScreenshotTile(0, 'lg:col-span-4', 900, 760)}

              <div className="lg:col-span-4 grid grid-cols-1 gap-5 md:gap-6">
                {renderScreenshotTile(1, '', 900, 760)}
                {renderScreenshotTile(2, '', 900, 760)}
              </div>
              {renderScreenshotTile(3, 'lg:col-span-4', 900, 760)}
              {renderScreenshotTile(4, 'lg:col-span-8', 800, 760)}
              {renderScreenshotTile(5, 'lg:col-span-4', 900, 760)}
            </div>
          )}
        </section>
      )}

      <div className="fixed bottom-4 inset-x-0 z-40 px-4">
        <div className="mx-auto max-w-4xl rounded-2xl border border-primary/30 bg-background/95 backdrop-blur px-4 py-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-foreground/90">Need a similar build for your business?</p>
            <div className="flex items-center gap-2">
              <Link
                href={projectContactHref}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Start Similar Project
              </Link>
              {project.liveLink && project.liveLink !== '/' && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  See Live Example
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h3 className="text-3xl font-bold mb-12 text-center">Related Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.relatedProjects.map((rp, index) => (
              <PortfolioCard
                key={index}
                data={{
                  _id: `${rp.slug?.current || rp.title}-${index}`,
                  title: rp.title,
                  slug: rp.slug,
                  description: rp.description || '',
                  mainImage: rp.mainImage,
                  category: rp.category || '',
                  skills: [],
                  liveLink: '/',
                  githubLink: '/',
                  role: rp.role,
                  teamSize: rp.teamSize,
                  duration: rp.duration,
                }}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />

      {isLightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onPrev={() =>
            setLightboxIndex(prev => (prev === 0 ? lightboxImages.length - 1 : prev - 1))
          }
          onNext={() =>
            setLightboxIndex(prev => (prev === lightboxImages.length - 1 ? 0 : prev + 1))
          }
        />
      )}
    </div>
  );
}
