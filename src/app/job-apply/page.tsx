import { readFileSync } from 'fs';
import { join } from 'path';
import PromptDisplay from './_components/PromptDisplay';
import { buildReferenceContent } from './_utils/buildReferenceContent';

function readFile(...segments: string[]): string {
  return readFileSync(join(process.cwd(), ...segments), 'utf-8').trim();
}

export default async function JobApplyPage() {
  const mainPrompt = readFile('src/app/job-apply/_data/main-prompt.md');
  const step1 = readFile('src/app/job-apply/_data/step-1.md');
  const step2 = readFile('src/app/job-apply/_data/step-2.md');
  const step3 = readFile('src/app/job-apply/_data/step-3.md');
  const step4 = readFile('src/app/job-apply/_data/step-4.md');
  const step5 = readFile('src/app/job-apply/_data/step-5.md');
  const { profileContent, experiencesContent, projectsContent } = await buildReferenceContent();

  return (
    <PromptDisplay
      mainPrompt={mainPrompt}
      step1={step1}
      step2={step2}
      step3={step3}
      step4={step4}
      step5={step5}
      profileContent={profileContent}
      experiencesContent={experiencesContent}
      projectsContent={projectsContent}
    />
  );
}
