'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTasks } from '@/context/TaskContext';
import { TaskStatus } from '@/types/task';
import { 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Tag, 
  Inbox,
  RefreshCw,
  LogIn,
  Lock
} from 'lucide-react';

export default function MyTasksPage() {
  const { tasks, updateTask, deleteTask, toggleSubtask, fetchTasks, tasksLoading, user, isLoading } = useTasks();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchTasks({
      status: statusFilter,
      priority: priorityFilter,
      search: search || undefined,
    });
  }, [statusFilter, priorityFilter, fetchTasks]);

  // Handle live search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks({
        status: statusFilter,
        priority: priorityFilter,
        search: search.trim() || undefined,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter, fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !search ||
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      task.category.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      task.status === statusFilter ||
      (statusFilter === 'On Hold' && task.status === 'Pending') ||
      (statusFilter === 'Not Start' && task.status === 'Blocked');

    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs text-slate-400">
            View, filter, and track all your tasks with progress details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTasks({ status: statusFilter, priority: priorityFilter, search })}
            disabled={tasksLoading}
            title="Refresh tasks from FastAPI backend"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
          >
            <RefreshCw className={`w-4 h-4 ${tasksLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <Link
            href="/tasks/create"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111827] p-3.5 rounded-xl border border-slate-800 shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter: Completed, In Progress, On Hold, Not Start */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-[#0d131f] border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Not Start">Not Start</option>
            </select>
          </div>

          {/* Priority Filter: Low, Medium, High only */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-[#0d131f] border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {!isLoading && !user ? (
        <div className="text-center py-12 bg-[#111827] rounded-xl border border-slate-800 p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Sign in to view your tasks</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tasks are saved in your personal PostgreSQL database via FastAPI.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-[#111827] rounded-xl border border-slate-800 p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">No tasks found</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {search || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating your very first task!'}
            </p>
          </div>
          <Link
            href="/tasks/create"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Task Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => {
            const completedSubtasksCount = task.subtasks?.filter((s) => s.isCompleted)?.length || 0;
            const totalSubtasksCount = task.subtasks?.length || 0;
            const subtaskProgress =
              totalSubtasksCount > 0
                ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100)
                : 0;

            const displayStatus =
              task.status === 'Pending' ? 'On Hold' : task.status === 'Blocked' ? 'Not Start' : task.status;

            return (
              <div
                key={task.id}
                className="bg-[#111827] rounded-2xl border border-slate-800/90 p-5 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl hover:shadow-black/50 transition-all group"
              >
                <div>
                  {/* Top Header: Priority Badge + Category + Status dropdown */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          task.priority === 'High' || task.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : task.priority === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {task.priority === 'Urgent' ? 'High' : task.priority}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 bg-[#0d131f] px-2 py-0.5 rounded-md border border-slate-800 truncate">
                        <Tag className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{task.category}</span>
                      </span>
                    </div>

                    <select
                      value={displayStatus}
                      onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer bg-[#0d131f] ${
                        displayStatus === 'Completed'
                          ? 'text-emerald-400 border-emerald-500/30'
                          : displayStatus === 'In Progress'
                          ? 'text-indigo-400 border-indigo-500/30'
                          : displayStatus === 'Not Start'
                          ? 'text-rose-400 border-rose-500/30'
                          : 'text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Not Start">Not Start</option>
                    </select>
                  </div>

                  {/* Task Name */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {task.name}
                  </h3>

                  {/* Description */}
                  {task.description && (
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Date range */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2.5 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {task.startDate}
                    </span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="text-slate-300 font-medium">{task.endDate}</span>
                  </div>

                  {/* Subtasks: Enhanced checklist */}
                  {totalSubtasksCount > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium text-slate-300">
                          Subtasks ({completedSubtasksCount}/{totalSubtasksCount})
                        </span>
                        <span className="text-indigo-400 font-bold">{subtaskProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${subtaskProgress}%` }}
                        />
                      </div>

                      <div className="space-y-1.5 pt-1 max-h-28 overflow-y-auto">
                        {task.subtasks.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubtask(task.id, sub.id)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs"
                          >
                            {sub.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            )}
                            <span
                              className={`truncate leading-tight ${
                                sub.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            >
                              {sub.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    ID: #{task.id.slice(0, 8)}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
