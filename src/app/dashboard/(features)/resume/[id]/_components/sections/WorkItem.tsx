'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@muzammil328/ui';
import { Label, Input } from '@muzammil328/form';
import { ChevronIconTop, ChevronIconBottom } from '@muzammil328/icon';
import { Trash2 } from 'lucide-react';
import { ResumeWork } from '../types';

interface WorkItemProps {
  job: ResumeWork;
  idx: number;
  totalCount: number;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
  onUpdate: (field: string, value: unknown) => void;
}

export function WorkItem({ job, idx, totalCount, onMove, onRemove, onUpdate }: WorkItemProps) {
  return (
    <AccordionItem value={`item-${idx}`}>
      <div className="flex justify-between items-center py-2">
        <AccordionTrigger className="hover:no-underline py-0 flex-1">
          <span className="font-medium text-sm text-left">
            #{idx + 1} {job.name || '(New Position)'}
          </span>
        </AccordionTrigger>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            disabled={idx === 0}
            onClick={e => {
              e.stopPropagation();
              onMove('up');
            }}
          >
            <ChevronIconTop className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            disabled={idx === totalCount - 1}
            onClick={e => {
              e.stopPropagation();
              onMove('down');
            }}
          >
            <ChevronIconBottom className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <AccordionContent className="p-1">
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={job.name} onChange={e => onUpdate('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input value={job.position} onChange={e => onUpdate('position', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={job.startDate}
                placeholder="YYYY-MM"
                onChange={e => onUpdate('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                value={job.endDate}
                placeholder="Present or YYYY-MM"
                onChange={e => onUpdate('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Highlights (Bullet points)</Label>
            <div className="space-y-2">
              {job.highlights.map((highlight, hIndex) => (
                <div key={hIndex} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={e => {
                      const newHighlights = [...job.highlights];
                      newHighlights[hIndex] = e.target.value;
                      onUpdate('highlights', newHighlights);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onUpdate(
                        'highlights',
                        job.highlights.filter((_, i) => i !== hIndex)
                      );
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onUpdate('highlights', [...job.highlights, ''])}
              >
                + Add Bullet Point
              </Button>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
