'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { toast } from '@muzammil328/ui';
import {
  ResumeData,
  ResumeBasics,
  ResumeLocation,
  ResumeEducation,
  ResumeSkill,
  ResumeProject,
  defaultResumeData,
} from '../types';

export function useResumeData() {
  const { id } = useParams();
  const router = useRouter();

  const [editableData, setEditableData] = useState<ResumeData>(defaultResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasFeatureAccess, setHasFeatureAccess] = useState<boolean | null>(null);
  const [sectionOrder, setSectionOrder] = useState<
    ('skills' | 'work' | 'projects' | 'education')[]
  >(['skills', 'work', 'projects', 'education']);
  const [activeWork, setActiveWork] = useState<string | undefined>(undefined);
  const [activeEducation, setActiveEducation] = useState<string | undefined>(undefined);
  const [activeSkills, setActiveSkills] = useState<string | undefined>(undefined);
  const [activeProjects, setActiveProjects] = useState<string | undefined>(undefined);
  const [injectedSummary, setInjectedSummary] = useState<string | null>(null);
  const [injectedSkills, setInjectedSkills] = useState<string[] | null>(null);
  const [injectedExperienceHighlights, setInjectedExperienceHighlights] = useState<
    Record<number, string[]>
  >({});
  const [selectedProjectIndices, setSelectedProjectIndices] = useState<number[] | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // Auth check
  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          router.replace('/auth/login');
          return;
        }
        const meJson = (await meRes.json()) as {
          data?: { user?: { role?: string; features?: string[] } };
        };
        const user = meJson.data?.user;
        const allowed = user?.role === 'admin' || Boolean(user?.features?.includes('resume'));
        if (!allowed) {
          router.replace('/dashboard');
          return;
        }
        setHasFeatureAccess(true);
      } catch (error) {
        console.error(error);
        router.replace('/auth/login');
      }
    };
    init();
  }, [router]);

  // Handle default id - redirect to default resume page
  useEffect(() => {
    if (id === 'default' && hasFeatureAccess === true) {
      router.replace('/dashboard/resume/default');
    }
  }, [id, hasFeatureAccess, router]);

  // Fetch resume data
  useEffect(() => {
    if (!id || hasFeatureAccess !== true) return;

    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/resume/${id}/`);
        if (!res.ok) {
          if (res.status === 404) {
            toast.error('Resume not found');
            router.push('/career/resume');
            return;
          }
          throw new Error('Failed to fetch');
        }
        const data = await res.json();

        if (data.sectionOrder) setSectionOrder(data.sectionOrder);

        setEditableData({
          basics: {
            ...defaultResumeData.basics,
            name: data.fullName || defaultResumeData.basics.name,
            email: data.email || defaultResumeData.basics.email,
            phone: data.phone || defaultResumeData.basics.phone,
            summary: data.summary || defaultResumeData.basics.summary,
            location: {
              ...defaultResumeData.basics.location,
              address: data.address || '',
              city: data.city || '',
              countryCode: data.countryCode || '',
            },
          },
          work:
            data.experience && Array.isArray(data.experience)
              ? data.experience
              : defaultResumeData.work,
          education: (data.education as ResumeEducation[]) || defaultResumeData.education,
          skills: (data.skills as ResumeSkill[]) || defaultResumeData.skills,
          projects:
            (data.projects as ResumeProject[])?.map((p: ResumeProject) => ({
              ...p,
              keywords: p.keywords || [],
              highlights: p.highlights || [],
            })) || defaultResumeData.projects,
          volunteer: defaultResumeData.volunteer,
          awards: defaultResumeData.awards,
        });
      } catch (error) {
        console.error(error);
        toast.error('Error loading resume');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [id, router, hasFeatureAccess]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dbPayload = {
        fullName: editableData.basics.name,
        email: editableData.basics.email,
        phone: editableData.basics.phone,
        address: editableData.basics.location.address,
        city: editableData.basics.location.city,
        countryCode: editableData.basics.location.countryCode,
        summary: editableData.basics.summary,
        experience: editableData.work,
        education: editableData.education,
        skills: editableData.skills,
        projects: editableData.projects,
      };
      const res = await fetch(`/api/resume/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbPayload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save');
        return;
      }
      const savedData = await res.json();
      if (savedData.experience) {
        setEditableData(prev => ({ ...prev, work: savedData.experience || prev.work }));
      }
      toast.success('Resume saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${editableData.basics.name}-Resume`,
    pageStyle: `
      @page { size: A4; margin: 0; margin-top: 1.25cm; }
      @page :first { margin-top: 0; }
      html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  const handleReset = () => {
    if (confirm('Are you sure? This will revert changes to the default template.')) {
      setEditableData(defaultResumeData);
    }
  };

  const updateBasics = (field: keyof ResumeBasics, value: ResumeBasics[keyof ResumeBasics]) => {
    setEditableData(prev => ({ ...prev, basics: { ...prev.basics, [field]: value } }));
  };

  const updateLocation = (field: keyof ResumeLocation, value: string) => {
    setEditableData(prev => ({
      ...prev,
      basics: { ...prev.basics, location: { ...prev.basics.location, [field]: value } },
    }));
  };

  const updateProfile = (network: string, url: string) => {
    setEditableData(prev => {
      const newProfiles = [...prev.basics.profiles];
      const index = newProfiles.findIndex(p => p.network === network);
      if (index >= 0) {
        newProfiles[index] = { ...newProfiles[index], url };
      } else {
        newProfiles.push({ network, username: '', url });
      }
      return { ...prev, basics: { ...prev.basics, profiles: newProfiles } };
    });
  };

  const addItem = (
    section: keyof ResumeData,
    item: unknown,
    setActiveState: (value: string) => void
  ) => {
    setEditableData(prev => {
      const currentSection = prev[section];
      const newSection = Array.isArray(currentSection) ? [...currentSection, item] : [item];
      setTimeout(() => setActiveState(`item-${newSection.length - 1}`), 0);
      return { ...prev, [section]: newSection };
    });
  };

  const removeItem = (section: keyof ResumeData, index: number) => {
    setEditableData(prev => {
      const currentSection = prev[section];
      const newSection = Array.isArray(currentSection)
        ? currentSection.filter((_, i) => i !== index)
        : [];
      return { ...prev, [section]: newSection };
    });
  };

  const moveItem = (section: keyof ResumeData, index: number, direction: 'up' | 'down') => {
    setEditableData(prev => {
      const currentSection = prev[section];
      if (!Array.isArray(currentSection)) return prev;
      const newSection = [...currentSection];
      if (direction === 'up' && index > 0) {
        [newSection[index], newSection[index - 1]] = [newSection[index - 1], newSection[index]];
      } else if (direction === 'down' && index < newSection.length - 1) {
        [newSection[index], newSection[index + 1]] = [newSection[index + 1], newSection[index]];
      }
      return { ...prev, [section]: newSection };
    });
  };

  const updateItem = (section: keyof ResumeData, index: number, field: string, value: unknown) => {
    setEditableData(prev => {
      const currentSection = prev[section];
      if (!Array.isArray(currentSection)) return prev;
      const newSection = [...currentSection] as object[];
      newSection[index] = { ...newSection[index], [field]: value };
      return { ...prev, [section]: newSection };
    });
  };

  const displayData = useMemo((): ResumeData => {
    const summary = injectedSummary !== null ? injectedSummary : editableData.basics.summary;
    const work = editableData.work.map((job, i) => ({
      ...job,
      highlights: [...job.highlights, ...(injectedExperienceHighlights[i] || [])],
    }));
    const skills =
      injectedSkills !== null && injectedSkills.length > 0
        ? editableData.skills.length > 0
          ? [
              {
                ...editableData.skills[0],
                keywords: [...editableData.skills[0].keywords, ...injectedSkills],
              },
              ...editableData.skills.slice(1),
            ]
          : [{ name: 'Skills', level: '', keywords: injectedSkills }]
        : editableData.skills;
    const projects =
      selectedProjectIndices != null && selectedProjectIndices.length > 0
        ? selectedProjectIndices
            .filter(idx => idx >= 0 && idx < editableData.projects.length)
            .map(idx => editableData.projects[idx])
        : editableData.projects;
    return { ...editableData, basics: { ...editableData.basics, summary }, work, skills, projects };
  }, [
    editableData,
    injectedSummary,
    injectedSkills,
    injectedExperienceHighlights,
    selectedProjectIndices,
  ]);

  return {
    id,
    editableData,
    isLoading,
    isSaving,
    isPreviewMode,
    setIsPreviewMode,
    hasFeatureAccess,
    sectionOrder,
    setSectionOrder,
    activeWork,
    setActiveWork,
    activeEducation,
    setActiveEducation,
    activeSkills,
    setActiveSkills,
    activeProjects,
    setActiveProjects,
    injectedSummary,
    setInjectedSummary,
    injectedSkills,
    setInjectedSkills,
    injectedExperienceHighlights,
    setInjectedExperienceHighlights,
    selectedProjectIndices,
    setSelectedProjectIndices,
    printRef,
    displayData,
    handleSave,
    handlePrint,
    handleReset,
    updateBasics,
    updateLocation,
    updateProfile,
    addItem,
    removeItem,
    moveItem,
    updateItem,
  };
}
