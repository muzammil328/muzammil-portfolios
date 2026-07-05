import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { getImageUrl } from '@/sanity/lib/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ServiceTypes } from '@/types/Service';

async function fetchServices() {
  const query = `*[_type == "service"] | order(_createdAt desc){
    _id,
    name,
    slug,
    image,
    summary,
    focus,
    timeline,
    pricing,
    isFeatured,
    proofPoints,
    testimonials,
    "skills": skills[]->{name, icon}
  }`;
  return client.fetch(query);
}

export const metadata = {
  title: 'Services | Muzammil Safdar',
  description: 'Explore the services I offer.',
  openGraph: {
    title: 'Services | Muzammil Safdar',
    description: 'Explore the services I offer.',
    type: 'website',
  },
};

export default async function Page() {
  const services = (await fetchServices()) as ServiceTypes[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">Services</h1>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const imageUrl = getImageUrl(service.image);
                const serviceSlug = service.slug?.current || service._id;

                return (
                  <Link key={service._id} href={`/services/${serviceSlug}`} className="group block">
                    <div className="rounded-3xl border border-border/70 bg-card p-6 transition-colors hover:bg-muted/50">
                      {imageUrl && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                          <Image
                            src={imageUrl}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}

                      <h2 className="text-2xl font-bold mb-2">{service.name}</h2>

                      {service.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {service.summary}
                        </p>
                      )}

                      {(service.timeline || service.pricing?.startingAt || service.isFeatured) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                          {service.isFeatured && (
                            <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-semibold uppercase tracking-wide text-primary">
                              Featured
                            </span>
                          )}
                          {service.timeline && (
                            <span className="rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground">
                              {service.timeline}
                            </span>
                          )}
                          {service.pricing?.startingAt && (
                            <span className="rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground">
                              From {service.pricing.currency || 'USD'} {service.pricing.startingAt}
                            </span>
                          )}
                        </div>
                      )}

                      {service.proofPoints && service.proofPoints.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {service.proofPoints.slice(0, 2).map((point, i) => (
                            <div key={i} className="rounded-xl border border-border/60 px-3 py-2">
                              <p className="text-sm font-bold text-primary">{point.value}</p>
                              <p className="text-[11px] text-muted-foreground">{point.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {service.testimonials && service.testimonials[0]?.quote && (
                        <blockquote className="mt-4 rounded-xl border border-border/60 bg-muted/25 px-3 py-2">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            &quot;{service.testimonials[0].quote}&quot;
                          </p>
                        </blockquote>
                      )}

                      {service.skills && service.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {service.skills.slice(0, 4).map((skill, i) => {
                            const iconUrl = getImageUrl(skill.icon, 32, 32);
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs font-medium"
                              >
                                {iconUrl ? (
                                  <Image
                                    src={iconUrl}
                                    alt={skill.name}
                                    width={16}
                                    height={16}
                                    className="inline-block"
                                  />
                                ) : null}
                                <span>{skill.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">No services available yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
