'use client';
import { ExternalLink } from 'lucide-react';
import { ChevronIconRight, ClockIcon, GitHubIcon, StarIcon, UserIcon } from '@/components/ui';
import { Badge } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PortfolioDetailWrapper({
  name,
  liveLink,
  githubLink,
  complete: _complete,
  duration,
  team,
  company,
  children,
  projectImages,
  technologies,
  features,
  relatedProjects,
}: {
  name: string;
  liveLink: string;
  githubLink: string;
  children: React.ReactNode;
  complete: string;
  duration: string;
  team: string;
  company: string;
  projectImages: {
    title: string;
    image: string;
  }[];
  technologies: string[];
  features: string[];
  relatedProjects: {
    title: string;
    image: string;
    description: string;
    tech: string[];
  }[];
}) {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Project Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Description */}
            <div className="space-y-6">
              {/* Project Stats */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* <div className="flex items-center space-x-2 text-foreground">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span className="text-sm">Completed: {complete}</span>
                  </div> */}
                <motion.div
                  className="flex items-center space-x-2 text-slate-600"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <ClockIcon className="w-5 h-5 text-teal-600" />
                  <span className="text-sm">Duration: {duration} months</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2 text-slate-600"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <UserIcon className="w-5 h-5 text-teal-600" />
                  <span className="text-sm">Team: {team} developers</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2 text-slate-600"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">Company: {company}</span>
                </motion.div>
              </motion.div>
              <motion.h2
                className="text-2xl font-semibold text-destructive"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {name}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {children}
              </motion.div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-6">
              <motion.h3
                className="text-2xl font-bold text-primary"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Project Gallery
              </motion.h3>
              <div className="space-y-8">
                {projectImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2,
                      ease: 'easeOut',
                    }}
                    className="relative group"
                  >
                    {/* Image Number Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.2 + 0.3,
                      }}
                      className="absolute -top-4 -left-4 z-20 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/50"
                    >
                      {index + 1}
                    </motion.div>

                    <div className="relative w-full rounded-2xl overflow-hidden bg-muted/20 border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20">
                      <Image
                        src={image.image || '/placeholder.svg'}
                        alt={image.title || `Project Screenshot ${index + 1}`}
                        width={1200}
                        height={800}
                        className="w-full h-auto max-h-150 rounded-2xl object-contain transform group-hover:scale-[1.02] transition-transform duration-500"
                        priority={index === 0}
                      />

                      {/* Image Title Overlay */}
                      {image.title && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.2 + 0.4,
                          }}
                          className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-6"
                        >
                          <p className="text-white font-medium text-lg">{image.title}</p>
                        </motion.div>
                      )}

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technologies Used */}
            <motion.div
              className="rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-primary mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge>{tech}</Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Project Links */}
            <motion.div
              className="rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-primary mb-4">Links</h3>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Link
                    href={liveLink}
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Live Demo</span>
                    </div>
                    <ChevronIconRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Link
                    href={githubLink}
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <GitHubIcon className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Source Code</span>
                    </div>
                    <ChevronIconRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-destructive mb-4">Key Features</h2>
            <p className="text-center">
              Discover the powerful features that make this project stand out from the competition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-xl p-6 shadow-lg border border-border hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-card"
              >
                <div className="flex items-start space-x-3">
                  <motion.div
                    className="shrink-0 w-8 h-8 bg-linear-to-r from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1 + 0.2,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </motion.div>
                  <p className="font-normal text-foreground">{feature}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-destructive mb-4">
              Related Projects
            </h2>
            <p className="text-center">
              Explore more of my work and see what else I&apos;ve been building.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: 'easeOut',
                }}
                whileHover={{ y: -12 }}
                className="group rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 bg-card hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || '/placeholder.svg'}
                    alt={project.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <motion.div
                    className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/30 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="px-6 py-3">
                  <h3 className="text-xl font-bold text-destructive mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 mb-4 text-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <motion.div
                        key={techIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.15 + techIndex * 0.05,
                        }}
                      >
                        <Badge className="px-2 py-1 text-xs">{tech}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
