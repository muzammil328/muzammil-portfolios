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
  Label,
} from '@muzammil328/form';
import { ChevronIconTop, ChevronIconBottom } from '@muzammil328/icon';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '../types';
import { SortableWrapper } from '../SortableWrapper';

interface ProjectsSectionProps {
  editableData: ResumeData;
  activeProjects: string | undefined;
  setActiveProjects: (val: string | undefined) => void;
  addItem: (section: keyof ResumeData, item: unknown, setActive: (v: string) => void) => void;
  removeItem: (section: keyof ResumeData, index: number) => void;
  moveItem: (section: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  updateItem: (section: keyof ResumeData, index: number, field: string, value: unknown) => void;
}

export function ProjectsSection({
  editableData,
  activeProjects,
  setActiveProjects,
  addItem,
  removeItem,
  moveItem,
  updateItem,
}: ProjectsSectionProps) {
  return (
    <SortableWrapper id="projects">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Portfolio Projects</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addItem('projects', { name: '', url: '', keywords: [], highlights: [] }, val =>
                setActiveProjects(val)
              )
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion
            type="single"
            collapsible
            value={activeProjects}
            onValueChange={setActiveProjects}
          >
            {editableData.projects.map((project, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <div className="flex justify-between items-center py-2">
                  <AccordionTrigger className="hover:no-underline py-0 flex-1">
                    <span className="font-medium text-sm text-left">
                      #{idx + 1} {project.name || '(New Project)'}
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
                        moveItem('projects', idx, 'up');
                      }}
                    >
                      <ChevronIconTop className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      disabled={idx === editableData.projects.length - 1}
                      onClick={e => {
                        e.stopPropagation();
                        moveItem('projects', idx, 'down');
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
                        removeItem('projects', idx);
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
                        <Label>Project Name</Label>
                        <Input
                          value={project.name}
                          onChange={e => updateItem('projects', idx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Project URL</Label>
                        <Input
                          value={project.url}
                          onChange={e => updateItem('projects', idx, 'url', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Skills (comma separated)</Label>
                      <Input
                        value={(project.keywords || []).join(', ')}
                        placeholder="React, Node.js, MongoDB"
                        onChange={e =>
                          updateItem(
                            'projects',
                            idx,
                            'keywords',
                            e.target.value
                              .split(',')
                              .map(s => s.trim())
                              .filter(Boolean)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Highlights (Bullet points)</Label>
                      <div className="space-y-2">
                        {(project.highlights || []).map((h: string, hIdx: number) => (
                          <div key={hIdx} className="flex gap-2">
                            <Input
                              value={h}
                              placeholder="Highlight point"
                              onChange={e => {
                                const newHighlights = [...(project.highlights || [])];
                                newHighlights[hIdx] = e.target.value;
                                updateItem('projects', idx, 'highlights', newHighlights);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() =>
                                updateItem(
                                  'projects',
                                  idx,
                                  'highlights',
                                  (project.highlights || []).filter(
                                    (_: string, i: number) => i !== hIdx
                                  )
                                )
                              }
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() =>
                            updateItem('projects', idx, 'highlights', [
                              ...(project.highlights || []),
                              '',
                            ])
                          }
                        >
                          + Add Highlight
                        </Button>
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
