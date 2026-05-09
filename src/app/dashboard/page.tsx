'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@muzammil328/ui';
import { LogOut, ListTodo, CheckSquare, FileText } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  features: string[];
}

const featureMetadata = {
  tasks: {
    name: 'Tasks',
    description: 'Manage your daily tasks with priorities and recurrence',
    icon: ListTodo,
    href: '/dashboard/task',
  },
  daily_report: {
    name: 'Daily Report',
    description: 'Track your daily habits and progress',
    icon: CheckSquare,
    href: '/dashboard/daily-report',
  },
  resume: {
    name: 'Resume',
    description: 'Build and manage your resume',
    icon: FileText,
    href: '/dashboard/resume',
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');

        if (!res.ok) {
          router.push('/auth/login');
          return;
        }

        const json = await res.json();
        setUser(json.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to logout');
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.name}!</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Features</CardTitle>
                <CardDescription>Available tools and features for your account</CardDescription>
              </CardHeader>
              <CardContent>
                {user.features && user.features.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {user.features.map(feature => {
                      const metadata = featureMetadata[feature as keyof typeof featureMetadata];
                      if (!metadata) return null;

                      const Icon = metadata.icon;

                      return (
                        <Link key={feature} href={metadata.href} className="block group">
                          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                            <CardContent className="pt-6">
                              <div className="flex flex-col items-start gap-3">
                                <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                                <div>
                                  <h3 className="font-semibold">{metadata.name}</h3>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {metadata.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No features available yet.</p>
                    <p className="text-sm mt-1">
                      Contact support to enable features for your account.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1 text-lg font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1 text-lg font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <p className="mt-1 text-lg font-medium capitalize">{user.role}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
