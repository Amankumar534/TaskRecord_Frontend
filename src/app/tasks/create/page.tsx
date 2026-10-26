'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/TaskContext';
import { TaskStatus, TaskPriority, Subtask } from '@/types/task';
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Layers,
  AlertCircle
} from 'lucide-react';

export default function CreateTaskPage() {
  const router = useRouter();
  const { addTask, user, isLoading } = useTasks();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Not Start');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState('Development');

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  }, []);

  const handleAddSubtask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      isCompleted: false,
    };

    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a task name.');
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    try {
      setSubmitting(true);
      await addTask({
        name: name.trim(),
        description: description.trim(),
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date().toISOString().split('T')[0],
        status,
        priority,
        category: category.trim() || 'General',
        subtasks,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/tasks');
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Failed to save task to backend.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-[#111827] border border-slate-800 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <h2 className="text-base font-bold text-white">Sign In Required</h2>
          <p className="text-xs text-slate-400 mt-1">
            Please sign in to record and save tasks directly to your secure database.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-3">
      {/* Back button */}
      <div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to tasks
        </Link>
      </div>

      {/* Main Compact Card */}
      <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl shadow-black/50 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Create Task Record
            </h1>
          </div>
        </div>

        {error && (
          <div className="p-2.5 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-2.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Task recorded successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Task Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Implement FastAPI JWT Authentication"
              className="w-full px-3 py-2 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or deliverable requirement..."
              className="w-full px-3 py-2 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Grid row 1: Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" />
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-rose-400" />
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Grid row 2: Status, Priority, Category */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-2 py-1.5 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Not Start">Not Start</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-2 py-1.5 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Dev, Bug, Design..."
                className="w-full px-2.5 py-1.5 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Subtasks: Compact Add Row */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Subtasks ({subtasks.length})
              </label>
              <span className="text-[10px] text-slate-500">Press enter or click Add</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add checklist subtask..."
                className="flex-1 px-3 py-1.5 bg-[#0d131f] border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSubtask()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* Subtasks Pills / mini list */}
            {subtasks.length > 0 && (
              <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {subtasks.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between px-2.5 py-1 bg-[#0d131f] rounded-lg border border-slate-800 text-xs"
                  >
                    <span className="flex items-center gap-1.5 text-slate-300 truncate">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-indigo-400 text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{sub.title}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800/80">
            <Link
              href="/tasks"
              className="px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {submitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
