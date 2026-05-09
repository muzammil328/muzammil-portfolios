'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input, Textarea, Label } from '@muzammil328/form';
import { Button } from '@muzammil328/ui';
import { submitContactForm } from '@/app/actions/contactForm';
import { ContactLeadSource } from '@/types/Service';

type ContactSectionProps = {
  defaultLeadSource?: ContactLeadSource;
  titleAs?: 'h1' | 'h3';
};

export default function ContactSection({
  defaultLeadSource = 'home',
  titleAs = 'h3',
}: ContactSectionProps) {
  const TitleTag = titleAs;
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    serviceInterested: '',
    projectType: '',
    budgetRange: '',
    desiredTimeline: '',
    projectReference: '',
    pagePath: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    website: '',
    leadSource: defaultLeadSource,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const service = searchParams.get('service');
    const project = searchParams.get('project');
    const pagePath = searchParams.get('page');
    const sourceParam = searchParams.get('source');
    const utmSource = searchParams.get('utm_source') || '';
    const utmMedium = searchParams.get('utm_medium') || '';
    const utmCampaign = searchParams.get('utm_campaign') || '';
    const leadSource: ContactLeadSource =
      sourceParam === 'service-detail' || sourceParam === 'portfolio-detail'
        ? sourceParam
        : sourceParam === 'home'
          ? 'home'
          : sourceParam === 'contact'
            ? 'contact'
            : defaultLeadSource;

    const initialMessage =
      service && project
        ? `Hi Muzammil, I am interested in your ${service} service for "${project}".\n\nProject details:`
        : service
          ? `Hi Muzammil, I am interested in your ${service} service.\n\nProject details:`
          : project
            ? `Hi Muzammil, I want a similar solution to "${project}".\n\nProject details:`
            : '';

    setFormData(prev => ({
      ...prev,
      leadSource,
      serviceInterested: prev.serviceInterested || service || '',
      projectReference: prev.projectReference || project || '',
      pagePath: prev.pagePath || pagePath || '',
      utmSource: prev.utmSource || utmSource,
      utmMedium: prev.utmMedium || utmMedium,
      utmCampaign: prev.utmCampaign || utmCampaign,
      website: prev.website,
      message: prev.message || initialMessage,
    }));
  }, [searchParams, defaultLeadSource]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Message sent successfully!',
        });
        setFormData({
          fname: '',
          lname: '',
          email: '',
          phone: '',
          serviceInterested: '',
          projectType: '',
          budgetRange: '',
          desiredTimeline: '',
          projectReference: '',
          pagePath: '',
          utmSource: '',
          utmMedium: '',
          utmCampaign: '',
          website: '',
          leadSource: defaultLeadSource,
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to send message',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: `An error occurred. Please try again.${error instanceof Error ? ` (${error.message})` : ''}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
            <h2 className="text-[2rem] sm:text-[4rem] md:text-[5rem] lg:text-[8rem] font-black uppercase text-muted-foreground/20 blur-sm w-full text-center select-none">
              CONTACT
            </h2>
          </div>
          <TitleTag className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
            Get In Touch
          </TitleTag>
          <p className="text-lg text-muted-foreground">
            Have a project in mind? Let&apos;s discuss how we can bring your ideas to life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fname" className="text-foreground">
                First Name
              </Label>
              <Input
                id="fname"
                name="fname"
                type="text"
                required
                value={formData.fname}
                onChange={handleChange}
                className="bg-background border-border"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lname" className="text-foreground">
                Last Name
              </Label>
              <Input
                id="lname"
                name="lname"
                type="text"
                required
                value={formData.lname}
                onChange={handleChange}
                className="bg-background border-border"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-background border-border"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="bg-background border-border"
                placeholder="000 000 000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceInterested" className="text-foreground">
                Service Needed
              </Label>
              <select
                id="serviceInterested"
                name="serviceInterested"
                value={formData.serviceInterested}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">Select a service</option>
                <option value="Web Development">Web Development</option>
                <option value="SaaS Development">SaaS Development</option>
                <option value="Maintenance & Support">Maintenance & Support</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-foreground">
                Project Type
              </Label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">Select project type</option>
                <option value="New build">New build</option>
                <option value="Redesign">Redesign</option>
                <option value="Feature extension">Feature extension</option>
                <option value="Bug fixing">Bug fixing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budgetRange" className="text-foreground">
                Budget Range
              </Label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">Select budget range</option>
                <option value="Under 1k">Under $1k</option>
                <option value="1k - 3k">$1k - $3k</option>
                <option value="3k - 7k">$3k - $7k</option>
                <option value="7k+">$7k+</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredTimeline" className="text-foreground">
                Desired Timeline
              </Label>
              <select
                id="desiredTimeline"
                name="desiredTimeline"
                value={formData.desiredTimeline}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">Select timeline</option>
                <option value="ASAP">ASAP</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="bg-background border-border min-h-37.5"
              placeholder="Tell me about your project..."
            />
          </div>

          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === 'success'
                  ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                  : 'bg-red-500/10 text-red-600 border border-red-500/20'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
          >
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
