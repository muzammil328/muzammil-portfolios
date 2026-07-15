import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioCard from '@/components/PortfolioCard';
import { getServiceBySlug, getProjectsByCategorySlug } from '@/services/portfolioService';
import { getExperiencesRelatedToServiceSlug } from '@/services/experienceService';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Muzammil Safdar',
      description: 'The requested service could not be found.',
    };
  }

  return {
    title: `${service.name} | Services | Muzammil Safdar`,
    description:
      service.summary || `Explore ${service.name} service details, process, and related projects.`,
    openGraph: {
      title: `${service.name} | Services | Muzammil Safdar`,
      description:
        service.summary ||
        `Explore ${service.name} service details, process, and related projects.`,
      type: 'article',
    },
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [service, relatedProjects, relatedExperiences] = await Promise.all([
    getServiceBySlug(slug),
    getProjectsByCategorySlug(),
    getExperiencesRelatedToServiceSlug(),
  ]);

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <Link href="/#services" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = service.image;
  const contactHref = `/contact?${new URLSearchParams({ service: service.name, source: 'service-detail' }).toString()}`;
  const whatsappHref = `https://wa.me/923100810327?text=${encodeURIComponent(
    `Hi Muzammil, I'm interested in your ${service.name} service. Can we discuss scope, timeline, and budget?`,
  )}`;
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary || undefined,
    provider: {
      '@type': 'Person',
      name: 'Muzammil Safdar',
      url: 'https://mmuzammil-portfolio.vercel.app',
    },
    areaServed: 'Worldwide',
    serviceType: service.name,
    offers: service.pricing?.startingAt
      ? {
          '@type': 'Offer',
          priceCurrency: service.pricing.currency || 'USD',
          price: service.pricing.startingAt,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              {imageUrl && (
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-8">
                  <Image src={imageUrl} alt={service.name} fill className="object-cover" priority />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{service.name}</h1>

              {service.summary && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {service.summary}
                </p>
              )}

              {(service.timeline || service.pricing?.startingAt || service.isFeatured) && (
                <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
                  {service.isFeatured && (
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold uppercase tracking-wide text-primary">
                      Featured Service
                    </span>
                  )}
                  {service.timeline && (
                    <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground">
                      Timeline: {service.timeline}
                    </span>
                  )}
                  {service.pricing?.startingAt && (
                    <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground">
                      Starting at {service.pricing.currency || 'USD'} {service.pricing.startingAt}
                    </span>
                  )}
                </div>
              )}

              {service.focus && service.focus.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">
                    Key Focus
                  </h2>
                  <ul className="space-y-3">
                    {(service.focus || []).map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-lg font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.idealClient && service.idealClient.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">
                    Ideal Client
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {service.idealClient.map((item, i) => (
                      <span
                        key={`ideal-${i}`}
                        className="rounded-full border border-border/60 px-3 py-1 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(service.skills || []).map((skill, i) => {
                    const iconUrl = skill.icon;
                    return (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 dark:bg-primary/30 text-sm font-medium"
                      >
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt={skill.name}
                            width={20}
                            height={20}
                            className="inline-block mr-2"
                          />
                        ) : null}
                        {skill.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {service.deliverables && service.deliverables.length > 0 && (
            <section className="mt-14 rounded-3xl border border-border/70 p-8 bg-card">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Deliverables</h2>
              <div className="flex flex-wrap gap-2">
                {service.deliverables.map((item, i) => (
                  <span
                    key={`deliverable-${i}`}
                    className="rounded-full border border-border/60 px-3 py-1.5 text-sm text-foreground/90"
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            </section>
          )}

          {service.processSteps && service.processSteps.length > 0 && (
            <section className="mt-10 rounded-3xl border border-border/70 p-8 bg-card">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">How I Deliver</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.processSteps.map((step, index) => (
                  <div key={`step-${index}`} className="rounded-2xl border border-border/60 p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Step {index + 1}
                    </p>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    {step.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {service.proofPoints && service.proofPoints.length > 0 && (
            <section className="mt-10 rounded-3xl border border-border/70 p-8 bg-card">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                Results & Proof
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.proofPoints.map((point, index) => (
                  <div key={`proof-${index}`} className="rounded-2xl border border-border/60 p-5">
                    <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {point.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{point.label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {service.testimonials && service.testimonials.length > 0 && (
            <section className="mt-10 rounded-3xl border border-border/70 p-8 bg-card">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                Client Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {service.testimonials.map((testimonial, index) => (
                  <article
                    key={`testimonial-${index}`}
                    className="rounded-2xl border border-border/60 p-5"
                  >
                    <p className="text-sm md:text-base text-foreground/90 leading-relaxed mb-4">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <p className="text-sm font-semibold">{testimonial.author}</p>
                    {testimonial.role && (
                      <p className="text-xs text-muted-foreground mt-1">{testimonial.role}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 rounded-3xl border border-primary/30 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-primary mb-2">
                  Ready To Start
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  Let&apos;s scope your {service.name} project
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Share your goals, budget, and timeline. You&apos;ll get a clear implementation
                  roadmap and next steps.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={contactHref}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Start Project Inquiry
                </Link>
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Chat On WhatsApp
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Projects in this category
              </h2>
              <Link href="/portfolio" className="text-primary hover:underline font-medium">
                View all projects
              </Link>
            </div>

            {relatedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.map((project, index) => (
                  <PortfolioCard key={project._id} data={project} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-8 text-center">
                <p className="text-muted-foreground">No projects found in this category yet.</p>
              </div>
            )}
          </section>

          {relatedExperiences.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Related Experience
                </h2>
                <Link href="/experiences" className="text-primary hover:underline font-medium">
                  View all experiences
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {relatedExperiences.slice(0, 4).map((exp) => (
                  <Link
                    key={exp._id}
                    href={`/experiences/${exp.slug}`}
                    className="rounded-2xl border border-border/70 bg-card p-5 hover:bg-muted/30 transition-colors"
                  >
                    <h3 className="text-xl font-semibold">{exp.company}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exp.position}</p>
                    {exp.summary && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {exp.summary}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
