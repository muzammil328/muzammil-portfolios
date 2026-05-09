'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Trash2, Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button, toast } from '@muzammil328/ui';

interface Resume {
  id: string;
  fullName: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserInfo {
  role: string;
}

export default function ResumeDashboard() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      fetchResumes();
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resume/');
      if (!res.ok) throw new Error('Failed to fetch resumes');
      const data = await res.json();
      setResumes(data);
    } catch (error) {
      toast.error('Could not load resumes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async () => {
    try {
      const res = await fetch('/api/resume/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Untitled Resume',
          email: '',
          skills: [],
          experience: [],
          education: [],
          projects: [],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to create resume');
        return;
      }

      const newResume = await res.json();
      toast.success('Resume created!');
      router.push(`/dashboard/resume/${newResume.id}`);
    } catch (error) {
      toast.error('Failed to create resume');
      console.error(error);
    }
  };

  const deleteResume = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const res = await fetch(`/api/resume/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');

      setResumes(prev => prev.filter(r => r.id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete resume');
    }
  };

  const isAdmin = userInfo?.role === 'admin';
  const hasResume = resumes.length > 0;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? 'Default Resume' : 'My Resumes'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'View your default resume from Sanity' : 'Manage and edit your resumes.'}
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin ? (
            <Link href="/dashboard/resume/default">
              <Button className="gap-2">
                <Eye className="w-4 h-4" />
                View Default Resume
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/dashboard/resume/default">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Use Default Resume
                </Button>
              </Link>
              {!hasResume && (
                <Button onClick={createResume} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create New
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isAdmin ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Admin User</h3>
          <p className="text-muted-foreground mb-4">
            Your resume is generated from your Sanity data.
          </p>
          <Link href="/dashboard/resume/default">
            <Button>View Default Resume</Button>
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No resumes found</h3>
          <p className="text-muted-foreground mb-6">
            Create your first resume or use the default from Sanity.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={createResume}>Create Resume</Button>
            <Link href="/dashboard/resume/default">
              <Button variant="outline">Use Default Resume</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <Link key={resume.id} href={`/dashboard/resume/${resume.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start justify-between">
                    <span className="truncate pr-2">{resume.fullName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {resume.summary || 'No summary provided.'}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 border-t bg-muted/10 flex justify-between items-center text-xs text-muted-foreground">
                  <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={e => deleteResume(resume.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
