'use client';

import React, { useState, useEffect } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  Trash2,
  GripVertical,
  Plus,
  Check,
  X,
  Pencil,
  Calendar as CalendarIcon,
  Repeat,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from '@muzammil328/ui';
import {
  Input,
  Calendar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox
} from '@muzammil328/form';

import { cn } from '@/lib/cn';

// --- Types ---

type Priority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'in_progress' | 'done' | 'archived';
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

interface Task {
  id: string;
  content: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: number;
  dueDate?: string; // ISO string
  recurrence: RecurrenceType;
}

interface ApiTask extends Omit<Task, 'createdAt'> {
  createdAt: string;
}

// --- Components ---

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider',
        colors[priority]
      )}
    >
      {priority}
    </span>
  );
};

const RecurrenceBadge = ({ type }: { type: RecurrenceType }) => {
  if (type === 'none') return null;
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
      <Repeat size={10} />
      <span className="capitalize">{type}</span>
    </div>
  );
};

const DateBadge = ({ date }: { date?: string }) => {
  if (!date) return null;
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
      <CalendarIcon size={10} />
      <span>{format(new Date(date), 'MMM d')}</span>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
}

const TaskItem = ({ task, onStatusChange, onDelete, onUpdate }: TaskItemProps) => {
  const dragControls = useDragControls();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.content);

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(task.id, editValue);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(task.content);
      setIsEditing(false);
    }
  };

  return (
    <Reorder.Item
      value={task}
      id={task.id}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        'group flex items-center gap-3 p-3 mb-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-all',
        task.status === 'done' && 'opacity-60 bg-muted/50'
      )}
    >
      <div
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        onPointerDown={e => dragControls.start(e)}
      >
        <GripVertical size={20} />
      </div>

      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={checked => onStatusChange(task.id, checked ? 'done' : 'pending')}
        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8"
            // autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
              <Check size={16} className="text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditValue(task.content);
                setIsEditing(false);
              }}
              className="h-8 w-8 p-0"
            >
              <X size={16} className="text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'font-medium truncate cursor-pointer select-none',
                  task.status === 'done' && 'line-through text-muted-foreground'
                )}
                onDoubleClick={() => setIsEditing(true)}
              >
                {task.content}
              </span>
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex items-center gap-2">
              <DateBadge date={task.dueDate} />
              <RecurrenceBadge type={task.recurrence} />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </Reorder.Item>
  );
};

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFeatureAccess, setHasFeatureAccess] = useState<boolean | null>(null);

  // Fetch tasks
  useEffect(() => {
    const init = async () => {
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
        const allowed = user?.role === 'admin' || Boolean(user?.features?.includes('tasks'));

        if (!allowed) {
          setHasFeatureAccess(false);
          return;
        }

        setHasFeatureAccess(true);
        await fetchTasks();
      } catch (error) {
        console.error(error);
        setHasFeatureAccess(false);
      } finally {
        setIsLoaded(true);
      }
    };

    init();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = (await res.json()) as ApiTask[];
      const mapped = data.map(t => ({
        ...t,
        createdAt: new Date(t.createdAt).getTime(),
      }));
      setTasks(mapped);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tasks');
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const tempId = crypto.randomUUID();
    const task: Task = {
      id: tempId,
      content: newTask.trim(),
      priority,
      status: 'pending',
      createdAt: Date.now(),
      recurrence,
      dueDate: date ? date.toISOString() : undefined,
    };

    // Optimistic update
    setTasks(prev => [task, ...prev]);
    setNewTask('');
    setPriority('medium');
    setRecurrence('none');
    setDate(undefined);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: task.content,
          priority: task.priority,
          status: task.status,
          recurrence: task.recurrence,
          dueDate: task.dueDate,
          createdAt: new Date(task.createdAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const errorPayload = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorPayload?.message || 'Failed to create task');
      }
      const created = await res.json();
      // Replace optimistic task with real one
      setTasks(prev => prev.map(t => (t.id === tempId ? { ...t, id: created.id } : t)));
      toast.success('Task added successfully');
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to save task';
      toast.error(message);
      setTasks(prev => prev.filter(t => t.id !== tempId)); // Revert
    }
  };

  const updateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    const oldTasks = [...tasks];

    // Optimistic update
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === id);
      if (taskIndex === -1) return prev;
      const task = prev[taskIndex];
      const updatedTasks = [...prev];
      updatedTasks[taskIndex] = { ...task, status: newStatus };
      return updatedTasks;
    });

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      const result = (await res.json()) as {
        task: ApiTask;
        nextTask: ApiTask | null;
      };

      setTasks(prev => {
        const normalized = prev.map(task =>
          task.id === id
            ? {
              ...task,
              content: result.task.content,
              priority: result.task.priority,
              status: result.task.status,
              recurrence: result.task.recurrence,
              dueDate: result.task.dueDate,
              createdAt: new Date(result.task.createdAt).getTime(),
            }
            : task
        );

        if (!result.nextTask) {
          return normalized;
        }

        return [
          {
            ...result.nextTask,
            createdAt: new Date(result.nextTask.createdAt).getTime(),
          },
          ...normalized,
        ];
      });

      if (result.nextTask?.dueDate) {
        toast.success(
          `Recurring task created for ${format(new Date(result.nextTask.dueDate), 'MMM d')}`
        );
      }
    } catch {
      setTasks(oldTasks); // Revert
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (id: string) => {
    const oldTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id)); // Optimistic

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Task deleted');
    } catch {
      setTasks(oldTasks); // Revert
      toast.error('Failed to delete task');
    }
  };

  const updateTask = async (id: string, newContent: string) => {
    const oldTasks = [...tasks];
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, content: newContent } : t))); // Optimistic

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) throw new Error('Failed to update content');
      toast.success('Task updated');
    } catch {
      setTasks(oldTasks); // Revert
      toast.error('Failed to update task');
    }
  };

  const activeTasks = tasks
    .filter(t => t.status === 'pending' || t.status === 'in_progress')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-8 text-muted-foreground h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasFeatureAccess) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="rounded-xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">
          You do not have access to Tasks. Ask an admin to enable the tasks feature.
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Daily Tasks</h1>
        <p className="text-muted-foreground">
          Manage your daily goals, set priorities, and track progress.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-4 shadow-sm mb-8">
        <form onSubmit={addTask} className="space-y-4">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            className="w-full"
          />
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Select value={priority} onValueChange={v => setPriority(v as Priority)}>
                <SelectTrigger className="w-27.5 h-9 text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Select value={recurrence} onValueChange={v => setRecurrence(v as RecurrenceType)}>
                <SelectTrigger className="w-27.5 h-9 text-xs">
                  <SelectValue placeholder="Repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-9 justify-start text-left font-normal text-xs',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {activeTasks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
            <p>No active tasks. Add one to get started!</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={activeTasks} onReorder={setTasks}>
            {activeTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}
