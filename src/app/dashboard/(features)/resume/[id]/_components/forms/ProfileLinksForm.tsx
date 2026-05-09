'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@muzammil328/ui';
import { Input, Label } from '@muzammil328/form';
import { ResumeBasics, ResumeData } from '../types';

interface ProfileLinksFormProps {
  editableData: ResumeData;
  updateBasics: (field: keyof ResumeBasics, value: ResumeBasics[keyof ResumeBasics]) => void;
  updateProfile: (network: string, url: string) => void;
}

export function ProfileLinksForm({
  editableData,
  updateBasics,
  updateProfile,
}: ProfileLinksFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Links & Profiles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Portfolio / Website</Label>
          <Input
            value={editableData.basics.url}
            onChange={e => updateBasics('url', e.target.value)}
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input
            value={editableData.basics.profiles.find(p => p.network === 'LinkedIn')?.url || ''}
            onChange={e => updateProfile('LinkedIn', e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input
            value={editableData.basics.profiles.find(p => p.network === 'GitHub')?.url || ''}
            onChange={e => updateProfile('GitHub', e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
