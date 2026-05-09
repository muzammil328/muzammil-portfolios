'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Trash2,
  Plus,
  Check,
  X,
  Pencil,
  History,
  CheckSquare,
  GripVertical,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  Button,
  Progress,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@muzammil328/ui';
import { Input, Checkbox } from '@muzammil328/form';
import { cn } from '@/lib/cn';

// --- Types ---

interface ReportItem {
  id: string;
  text: string;
  time: string;
  checked: boolean;
}

interface ReportHistory {
  id: string;
  date: string; // ISO string
  score: number;
  totalItems: number;
  completedItems: number;
  itemsSnapshot: ReportItem[];
}

// --- Components ---

interface ReportItemProps {
  item: ReportItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string, newTime: string) => void;
}

const ReportItemRow = ({ item, onToggle, onDelete, onUpdate }: ReportItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.text);
  const [editTime, setEditTime] = useState(item.time);
  const dragControls = useDragControls();

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(item.id, editValue, editTime);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(item.text);
      setEditTime(item.time);
      setIsEditing(false);
    }
  };

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        'group flex items-center gap-3 p-3 mb-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md',
        item.checked && 'bg-muted/30 border-primary/20'
      )}
    >
      <div
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        onPointerDown={e => dragControls.start(e)}
      >
        <GripVertical size={20} />
      </div>

      <Checkbox
        checked={item.checked}
        onCheckedChange={() => onToggle(item.id)}
        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5"
      />

      <div className="flex-1 min-w-0 flex items-center gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="time"
              value={editTime}
              onChange={e => setEditTime(e.target.value)}
              className="h-8 w-28"
            />
            <Input
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 flex-1"
              // autoFocus
            />
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                <Check size={16} className="text-green-600 dark:text-green-400" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditValue(item.text);
                  setEditTime(item.time);
                  setIsEditing(false);
                }}
                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <X size={16} className="text-red-600 dark:text-red-400" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs font-mono text-muted-foreground whitespace-nowrap',
                !item.time && 'hidden'
              )}
            >
              <Clock size={12} />
              {item.time}
            </div>
            <span
              className={cn(
                'font-medium truncate cursor-pointer select-none block flex-1',
                item.checked && 'line-through text-muted-foreground decoration-primary/50'
              )}
              onDoubleClick={() => setIsEditing(true)}
            >
              {item.text}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </Reorder.Item>
  );
};

const DailyReportPage = () => {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [history, setHistory] = useState<ReportHistory[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFeatureAccess, setHasFeatureAccess] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('today');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          setHasFeatureAccess(false);
          return;
        }

        const meJson = (await meRes.json()) as {
          data?: { user?: { role?: string; features?: string[] } };
        };

        const user = meJson.data?.user;
        const allowed = user?.role === 'admin' || Boolean(user?.features?.includes('daily_report'));

        if (!allowed) {
          setHasFeatureAccess(false);
          return;
        }

        setHasFeatureAccess(true);

        const [itemsRes, historyRes] = await Promise.all([
          fetch('/api/daily-report/items'),
          fetch('/api/daily-report/history'),
        ]);

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setItems(itemsData);
        }

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load report data');
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Actions
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    try {
      const res = await fetch('/api/daily-report/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newItemText.trim(),
          time: newItemTime,
        }),
      });

      if (!res.ok) throw new Error('Failed to add item');

      const newItem = await res.json();

      // Auto-sort on add if time is provided
      setItems(prev => {
        const updated = [...prev, newItem];
        if (newItemTime) {
          updated.sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
          });
        }
        return updated;
      });

      setNewItemText('');
      setNewItemTime('');
      toast.success('Item added to report');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item');
    }
  };

  const toggleItem = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    // Optimistic update
    setItems(prev => prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i)));

    try {
      const res = await fetch(`/api/daily-report/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked: !item.checked }),
      });

      if (!res.ok) {
        // Revert on failure
        setItems(prev => prev.map(i => (i.id === id ? { ...i, checked: item.checked } : i)));
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const deleteItem = async (id: string) => {
    // Optimistic update
    const previousItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch(`/api/daily-report/items/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        setItems(previousItems);
        throw new Error('Failed to delete item');
      }
      toast.success('Item removed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    }
  };

  const updateItem = async (id: string, newText: string, newTime: string) => {
    const previousItems = [...items];
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, text: newText, time: newTime } : item))
    );

    try {
      const res = await fetch(`/api/daily-report/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText, time: newTime }),
      });

      if (!res.ok) {
        setItems(previousItems);
        throw new Error('Failed to update item');
      }
      toast.success('Item updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update item');
    }
  };

  const sortItems = () => {
    setItems(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });
      toast.success('Sorted by time');
      return sorted;
    });
  };

  const submitReport = async () => {
    const total = items.length;
    if (total === 0) {
      toast.error('Add items to submit a report');
      return;
    }

    const completed = items.filter(i => i.checked).length;
    const score = Math.round((completed / total) * 100);

    // We send current date, API handles normalization/uniqueness
    const reportDate = new Date().toISOString();

    try {
      const res = await fetch('/api/daily-report/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: reportDate,
          score,
          totalItems: total,
          completedItems: completed,
          itemsSnapshot: items,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit report');

      const savedReport = await res.json();

      // Update history state
      setHistory(prev => {
        // Remove existing entry for today if any (based on ID or date check)
        // Since we upserted, we can just filter out any entry with same ID or Date
        // But simplified: just replace or add.

        // Find if we have an entry with same ID or Date
        const idx = prev.findIndex(
          h =>
            h.id === savedReport.id ||
            new Date(h.date).toDateString() === new Date(savedReport.date).toDateString()
        );

        if (idx >= 0) {
          const newHistory = [...prev];
          newHistory[idx] = savedReport;
          return newHistory;
        }
        return [savedReport, ...prev];
      });

      toast.success(`Report submitted! Score: ${score}%`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit report');
    }
  };

  // Calculations
  const totalItems = items.length;
  const completedItems = items.filter(i => i.checked).length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (!isLoaded) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">Loading report...</div>
    );
  }

  if (!hasFeatureAccess) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="rounded-xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">
          You do not have access to Daily Report. Ask an admin to enable the daily report feature.
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CheckSquare className="h-8 w-8 text-primary" />
          Daily Report
        </h1>
        <p className="text-muted-foreground">
          Track your daily habits and consistency. Submit your report to save progress.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="today">Today&apos;s Report</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-6">
                <form onSubmit={addItem} className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground ml-1">Time</span>
                    <Input
                      type="time"
                      value={newItemTime}
                      onChange={e => setNewItemTime(e.target.value)}
                      className="w-full sm:w-32 bg-background"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-medium text-muted-foreground ml-1">Task</span>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Add a new habit or task..."
                        value={newItemText}
                        onChange={e => setNewItemText(e.target.value)}
                        className="flex-1 bg-background"
                      />
                      <Button type="submit" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span>{format(new Date(), 'EEEE, MMMM do, yyyy')}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sortItems}
                    className="hidden sm:flex items-center gap-1.5 h-8 text-xs font-normal"
                  >
                    <ArrowUpDown size={14} />
                    Sort by Time
                  </Button>
                </div>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    progress === 100 ? 'text-green-600' : 'text-primary'
                  )}
                >
                  {progress}%
                </span>
              </CardTitle>
              <CardDescription>
                {completedItems} of {totalItems} tasks completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-3 mb-6" />

              <div className="space-y-1">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No items in your daily report.</p>
                    <p className="text-sm mt-1">Add items to track your daily progress.</p>
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={items} onReorder={setItems}>
                    {items.map(item => (
                      <ReportItemRow
                        key={item.id}
                        item={item}
                        onToggle={toggleItem}
                        onDelete={deleteItem}
                        onUpdate={updateItem}
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-6">
              <div className="text-xs text-muted-foreground order-2 sm:order-1">
                * Submitting saves today&apos;s score to history.
              </div>
              <Button
                onClick={submitReport}
                className="w-full sm:w-auto order-1 sm:order-2"
                size="lg"
              >
                Submit Daily Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" />
              History Log
            </h2>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No history records found.</p>
                  <p className="text-sm">Submit your first report today!</p>
                </div>
              ) : (
                history.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm border-2',
                          entry.score >= 80
                            ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20'
                            : entry.score >= 50
                              ? 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                              : 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
                        )}
                      >
                        {entry.score}%
                      </div>
                      <div>
                        <div className="font-medium">
                          {format(new Date(entry.date), 'MMMM do, yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.completedItems} / {entry.totalItems} tasks completed
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(entry.date), 'h:mm a')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyReportPage;
