'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { ResumeData } from '../types';
import { PreviewSectionRenderer } from './PreviewSectionRenderer';

interface ResumePreviewProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  displayData: ResumeData;
  sectionOrder: string[];
  isPreviewMode: boolean;
}

export function ResumePreview({
  printRef,
  displayData,
  sectionOrder,
  isPreviewMode,
}: ResumePreviewProps) {
  return (
    <div
      className={cn(
        'h-full overflow-x-hidden overflow-y-hidden bg-gray-100 rounded-lg shadow-inner p-4 md:p-8 transition-all duration-300',
        isPreviewMode ? 'block w-full max-w-4xl mx-auto' : 'hidden lg:block'
      )}
    >
      <div className="h-full overflow-y-auto overflow-x-auto flex min-w-0 bg-gray-100 rounded-lg">
        <div className="shrink-0 scale-[0.65] origin-top-left md:scale-[0.85] xl:scale-100 transition-transform duration-200">
          <div
            ref={printRef}
            className="bg-white text-black shadow-xl w-[210mm] min-h-[297mm] p-0 border-0"
            style={{ fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif' }}
          >
            {/* Resume Header */}
            <div className="px-10 pt-10 pb-2 text-left break-inside-avoid">
              <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
                {displayData.basics.name || 'Your Name'}
              </h1>
              <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                {displayData.basics.label || 'Job Title'}
              </h2>

              <div className="flex flex-wrap items-center text-sm gap-3 text-black/80 leading-relaxed">
                {displayData.basics.phone && <span>{displayData.basics.phone}</span>}

                {displayData.basics.phone &&
                  (displayData.basics.location.city || displayData.basics.email) && (
                    <span className="text-black/30">|</span>
                  )}

                {(displayData.basics.location.city || displayData.basics.location.countryCode) && (
                  <span>
                    {[displayData.basics.location.city, displayData.basics.location.countryCode]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                )}

                {displayData.basics.location.city && displayData.basics.email && (
                  <span className="text-black/30">|</span>
                )}

                {displayData.basics.email && (
                  <a
                    href={`mailto:${displayData.basics.email}`}
                    className="hover:text-teal-700 transition-colors"
                  >
                    {displayData.basics.email}
                  </a>
                )}

                {displayData.basics.email && displayData.basics.url && (
                  <span className="text-black/30">|</span>
                )}

                {displayData.basics.url && (
                  <a
                    href={displayData.basics.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-teal-700 underline underline-offset-2"
                  >
                    Portfolio
                  </a>
                )}

                {displayData.basics.profiles.map(
                  (profile, i) =>
                    profile.url && (
                      <React.Fragment key={i}>
                        <span className="text-black/30">|</span>
                        <a
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-teal-700 underline underline-offset-2"
                        >
                          {profile.network}
                        </a>
                      </React.Fragment>
                    )
                )}
              </div>
            </div>

            {/* Resume Body */}
            <div className="px-10 pt-4 pb-20 space-y-6" style={{ marginTop: 0 }}>
              {displayData.basics.summary && (
                <section className="break-inside-avoid">
                  <h3 className="text-lg font-bold text-black pb-0.5 mb-1.5 uppercase tracking-wider">
                    Summary
                  </h3>
                  <p className="text-sm leading-relaxed text-black/90 text-justify mt-0">
                    {displayData.basics.summary}
                  </p>
                </section>
              )}

              {sectionOrder.map(section => (
                <div key={section} className="break-inside-avoid">
                  <PreviewSectionRenderer section={section} data={displayData} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
