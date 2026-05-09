'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@muzammil328/ui';
import {
  Input,
  Label
} from '@muzammil328/form';
import { ChevronIconTop, ChevronIconBottom } from '@muzammil328/icon';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '../types';
import { SortableWrapper } from '../SortableWrapper';

interface EducationSectionProps {
  editableData: ResumeData;
  activeEducation: string | undefined;
  setActiveEducation: (val: string | undefined) => void;
  addItem: (section: keyof ResumeData, item: unknown, setActive: (v: string) => void) => void;
  removeItem: (section: keyof ResumeData, index: number) => void;
  moveItem: (section: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  updateItem: (section: keyof ResumeData, index: number, field: string, value: unknown) => void;
}

export function EducationSection({
  editableData,
  activeEducation,
  setActiveEducation,
  addItem,
  removeItem,
  moveItem,
  updateItem,
}: EducationSectionProps) {
  return (
    <SortableWrapper id="education">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Education</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addItem(
                'education',
                {
                  institution: '',
                  url: '',
                  area: '',
                  studyType: '',
                  startDate: '',
                  endDate: '',
                  score: '',
                  courses: [],
                },
                val => setActiveEducation(val)
              )
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion
            type="single"
            collapsible
            value={activeEducation}
            onValueChange={setActiveEducation}
          >
            {editableData.education.map((edu, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <div className="flex justify-between items-center py-2">
                  <AccordionTrigger className="hover:no-underline py-0 flex-1">
                    <span className="font-medium text-sm text-left">
                      #{idx + 1} {edu.institution || '(New)'}
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
                        moveItem('education', idx, 'up');
                      }}
                    >
                      <ChevronIconTop className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      disabled={idx === editableData.education.length - 1}
                      onClick={e => {
                        e.stopPropagation();
                        moveItem('education', idx, 'down');
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
                        removeItem('education', idx);
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
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={e =>
                            updateItem('education', idx, 'institution', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree / Study Type</Label>
                        <Input
                          value={edu.studyType}
                          onChange={e => updateItem('education', idx, 'studyType', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Area of Study</Label>
                        <Input
                          value={edu.area}
                          onChange={e => updateItem('education', idx, 'area', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA / Score</Label>
                        <Input
                          value={edu.score}
                          onChange={e => updateItem('education', idx, 'score', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          value={edu.startDate}
                          placeholder="YYYY-MM"
                          onChange={e => updateItem('education', idx, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          value={edu.endDate}
                          placeholder="YYYY-MM"
                          onChange={e => updateItem('education', idx, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </SortableWrapper>
  );
}
