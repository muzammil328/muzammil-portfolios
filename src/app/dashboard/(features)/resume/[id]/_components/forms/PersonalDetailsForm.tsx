'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@muzammil328/ui';
import { Input, Label, Textarea } from '@muzammil328/form';
import { ResumeBasics, ResumeData, ResumeLocation } from '../types';

interface PersonalDetailsFormProps {
  editableData: ResumeData;
  updateBasics: (field: keyof ResumeBasics, value: ResumeBasics[keyof ResumeBasics]) => void;
  updateLocation: (field: keyof ResumeLocation, value: string) => void;
}

export function PersonalDetailsForm({
  editableData,
  updateBasics,
  updateLocation,
}: PersonalDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={editableData.basics.name}
              onChange={e => updateBasics('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              value={editableData.basics.label}
              onChange={e => updateBasics('label', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={editableData.basics.email}
              onChange={e => updateBasics('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={editableData.basics.phone}
              onChange={e => updateBasics('phone', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={editableData.basics.location.city}
              onChange={e => updateLocation('city', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Country Code</Label>
            <Input
              value={editableData.basics.location.countryCode}
              onChange={e => updateLocation('countryCode', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Professional Summary</Label>
          <Textarea
            value={editableData.basics.summary}
            onChange={e => updateBasics('summary', e.target.value)}
            className="min-h-25"
          />
        </div>
      </CardContent>
    </Card>
  );
}
