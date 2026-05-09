'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@muzammil328/ui';
import {
  Input,
  Label,
  Textarea,
} from '@muzammil328/form';
import { ChevronIconTop, ChevronIconBottom } from '@muzammil328/icon';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '../types';
import { SortableWrapper } from '../SortableWrapper';

interface SkillsSectionProps {
  editableData: ResumeData;
  activeSkills: string | undefined;
  setActiveSkills: (val: string | undefined) => void;
  addItem: (section: keyof ResumeData, item: unknown, setActive: (v: string) => void) => void;
  removeItem: (section: keyof ResumeData, index: number) => void;
  moveItem: (section: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  updateItem: (section: keyof ResumeData, index: number, field: string, value: unknown) => void;
}

export function SkillsSection({
  editableData,
  activeSkills,
  setActiveSkills,
  addItem,
  removeItem,
  moveItem,
  updateItem,
}: SkillsSectionProps) {
  return (
    <SortableWrapper id="skills">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Skills</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addItem('skills', { name: 'Category', level: '', keywords: [] }, val =>
                setActiveSkills(val)
              )
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible value={activeSkills} onValueChange={setActiveSkills}>
            {editableData.skills.map((skill, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <div className="flex justify-between items-center py-2">
                  <AccordionTrigger className="hover:no-underline py-0 flex-1">
                    <span className="font-medium text-sm text-left">
                      #{idx + 1} {skill.name}
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
                        moveItem('skills', idx, 'up');
                      }}
                    >
                      <ChevronIconTop className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      disabled={idx === editableData.skills.length - 1}
                      onClick={e => {
                        e.stopPropagation();
                        moveItem('skills', idx, 'down');
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
                        removeItem('skills', idx);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <AccordionContent className="p-1">
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Category Name (e.g. Languages, Tools)</Label>
                      <Input
                        value={skill.name}
                        onChange={e => updateItem('skills', idx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Keywords (Comma separated)</Label>
                      <Textarea
                        value={skill.keywords.join(', ')}
                        onChange={e =>
                          updateItem(
                            'skills',
                            idx,
                            'keywords',
                            e.target.value.split(',').map(s => s.trim())
                          )
                        }
                        placeholder="React, Node.js, TypeScript, etc."
                        className="min-h-20"
                      />
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
