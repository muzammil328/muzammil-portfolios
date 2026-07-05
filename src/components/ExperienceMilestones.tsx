'use client';

import React from 'react';
import { CloseIcon } from '@/components/ui';

interface Milestone {
  _key: string;
  title: string;
  type: string;
  description?: string;
  date?: string;
  link?: string;
  imageUrls?: string[];
}

interface ExperienceMilestonesProps {
  milestones: Milestone[];
}

function formatMilestoneDate(date?: string): string {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function ExperienceMilestones({ milestones }: ExperienceMilestonesProps) {
  const [selectedMilestone, setSelectedMilestone] = React.useState<Milestone | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const openMilestoneModal = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setSelectedImageIndex(0);
  };

  const closeModal = () => {
    setSelectedMilestone(null);
    setSelectedImageIndex(0);
  };

  const selectedMilestoneDate = selectedMilestone
    ? formatMilestoneDate(selectedMilestone.date)
    : '';

  const selectedMilestoneImages = selectedMilestone?.imageUrls ?? [];
  const selectedMilestonePrimaryImage =
    selectedMilestoneImages[selectedImageIndex] ?? selectedMilestoneImages[0];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones.map((milestone) => {
          const formattedDate = formatMilestoneDate(milestone.date);
          const primaryImage = milestone.imageUrls?.[0];

          return (
            <button
              key={milestone._key}
              type="button"
              onClick={() => openMilestoneModal(milestone)}
              className="w-full text-left rounded-2xl border border-border/70 bg-card overflow-hidden hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {primaryImage && (
                <div className="w-full h-80 overflow-hidden">
                  <img
                    src={primaryImage}
                    alt={milestone.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                    {milestone.type}
                  </span>
                  {formattedDate && (
                    <span className="text-xs text-muted-foreground">{formattedDate}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {milestone.link ? (
                    <a
                      href={milestone.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="hover:text-primary hover:underline"
                    >
                      {milestone.title}
                    </a>
                  ) : (
                    milestone.title
                  )}
                </h3>
                {milestone.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {milestone.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedMilestone && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/65 px-4 py-6">
          <div className="absolute inset-0" onClick={closeModal} aria-hidden="true" />

          <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/70 bg-card">
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 rounded-full border border-border bg-background/90 p-2 text-foreground hover:bg-muted"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            <div
              className={
                selectedMilestonePrimaryImage ? 'grid md:grid-cols-[1.1fr_0.9fr]' : 'block'
              }
            >
              {selectedMilestonePrimaryImage && (
                <div className="min-h-70 md:min-h-140 bg-muted/20 flex items-center justify-center p-4 md:p-6">
                  <img
                    src={selectedMilestonePrimaryImage}
                    alt={selectedMilestone.title}
                    className="w-full max-h-[70vh] object-contain object-center"
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                    {selectedMilestone.type}
                  </span>
                  {selectedMilestoneDate && (
                    <span className="text-xs text-muted-foreground">{selectedMilestoneDate}</span>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                  {selectedMilestone.link ? (
                    <a
                      href={selectedMilestone.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      {selectedMilestone.title}
                    </a>
                  ) : (
                    selectedMilestone.title
                  )}
                </h3>
                <p className="text-base leading-relaxed text-foreground/80">
                  {selectedMilestone.description ||
                    'No additional details provided for this milestone.'}
                </p>

                {selectedMilestoneImages.length > 1 && (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                      Images
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedMilestoneImages.map((imageUrl, index) => (
                        <button
                          key={`${selectedMilestone._key}-image-${index}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(index)}
                          className={`rounded-md overflow-hidden border transition-colors ${
                            selectedImageIndex === index
                              ? 'border-primary'
                              : 'border-border/70 hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`${selectedMilestone.title} image ${index + 1}`}
                            className="w-full h-20 object-cover object-top"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
