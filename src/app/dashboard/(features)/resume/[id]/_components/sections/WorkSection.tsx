'use client';

import { Accordion, Button, Card, CardContent, CardHeader, CardTitle } from '@muzammil328/ui';
import { Plus } from 'lucide-react';
import { ResumeData } from '../types';
import { SortableWrapper } from '../SortableWrapper';
import { WorkItem } from './WorkItem';

interface WorkSectionProps {
  editableData: ResumeData;
  activeWork: string | undefined;
  setActiveWork: (val: string | undefined) => void;
  addItem: (section: keyof ResumeData, item: unknown, setActive: (v: string) => void) => void;
  removeItem: (section: keyof ResumeData, index: number) => void;
  moveItem: (section: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  updateItem: (section: keyof ResumeData, index: number, field: string, value: unknown) => void;
}

export function WorkSection({
  editableData,
  activeWork,
  setActiveWork,
  addItem,
  removeItem,
  moveItem,
  updateItem,
}: WorkSectionProps) {
  return (
    <SortableWrapper id="work">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Experience</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addItem(
                'work',
                {
                  name: '',
                  position: '',
                  url: '',
                  startDate: '',
                  endDate: '',
                  summary: '',
                  highlights: [],
                  projects: [],
                },
                val => setActiveWork(val)
              )
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible value={activeWork} onValueChange={setActiveWork}>
            {editableData.work.map((job, idx) => (
              <WorkItem
                key={idx}
                job={job}
                idx={idx}
                totalCount={editableData.work.length}
                onMove={direction => moveItem('work', idx, direction)}
                onRemove={() => removeItem('work', idx)}
                onUpdate={(field, value) => updateItem('work', idx, field, value)}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </SortableWrapper>
  );
}
