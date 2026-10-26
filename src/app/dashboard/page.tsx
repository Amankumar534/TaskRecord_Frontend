'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTasks } from '@/context/TaskContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo, 
  TrendingUp, 
  Calendar, 
  Plus, 
  ArrowUpRight,
  ShieldAlert,
  PieChart as PieChartIcon,
  RefreshCw,
  LogIn,
  Lock
} from 'lucide-react';

export default function DashboardPage() {
  const { tasks, user, dashboardStats, fetchDashboardStats, fetchTasks, tasksLoading, isLoading } = useTasks();

  // Auth guard
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-[#111827] border border-slate-800 rounded-2xl p-8 flex flex-col items-center gap-5 shadow-xl shadow-black/40 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Login Required</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              You need to be logged in to access the Dashboard. Please sign in to view your task metrics.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/25"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      fetchTasks();
    }
  }, [user, fetchDashboardStats, fetchTasks]);

  // Use backend stats when available, fallback to computed from tasks
  const totalTasks = dashboardStats ? dashboardStats.totalTasks : tasks.length;
  const completedTasks = dashboardStats ? dashboardStats.completedTasks : tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = dashboardStats ? dashboardStats.inProgressTasks : tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = dashboardStats ? dashboardStats.pendingTasks : tasks.filter((t) => t.status === 'On Hold' || t.status === 'Pending').length;
  const blockedTasks = dashboardStats ? dashboardStats.blockedTasks : tasks.filter((t) => t.status === 'Not Start' || t.status === 'Blocked').length;
  const completionRate = dashboardStats ? dashboardStats.completionRate : (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
  const urgentCount = dashboardStats ? dashboardStats.urgentCount : tasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl shadow-black/40">
        <div>          
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome, {user ? user.fullName : 'Guest'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-0.5">
            Real-time task metrics, completion speed, and active workload synced with Database.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {user && (
            <button
              onClick={() => {
                fetchDashboardStats();
                fetchTasks();
              }}
              disabled={tasksLoading}
              title="Refresh Stats"
              className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/80"
            >
              <RefreshCw className={`w-4 h-4 ${tasksLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          )}
          <Link
            href="/tasks/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </Link>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs border border-slate-700 hover:border-slate-600 transition-colors"
          >
            My Tasks
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-2">
        {/* Total Tasks */}
        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalTasks}</span>
            <span className="text-[11px] text-slate-500">recorded</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{completedTasks}</span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              {completionRate}%
            </span>
          </div>          
        </div>

        {/* In Progress */}
        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">{inProgressTasks}</span>
            <span className="text-[11px] text-slate-500">active</span>
          </div>
        </div>

        {/* Urgent & On Hold */}
        <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Urgent / Sprints</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">{urgentCount}</span>
            {pendingTasks > 0 && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                {pendingTasks} on hold
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lower Section: Priority Tasks (Left) and Pie Chart Status Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Priority Task List (Left side - 2 cols) */}
        <div className="lg:col-span-2 bg-[#111827] p-5 rounded-2xl border border-slate-800/90 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Urgent & Active Priority Tasks
            </h2>
            <Link
              href="/tasks"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
            >
              View all ({tasks.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        task.priority === 'Urgent' || task.priority === 'High'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : task.priority === 'Medium'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[11px] text-slate-500">{task.category}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-200 truncate">{task.name}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {task.startDate} &rarr; {task.endDate}
                    </span>
                    {task.subtasks?.length > 0 && (
                      <span className="text-indigo-400">
                        {task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length} subtasks
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : task.status === 'In Progress'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : task.status === 'Not Start' || task.status === 'Blocked'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {task.status === 'Blocked' ? 'Not Start' : task.status === 'Pending' ? 'On Hold' : task.status}
                  </span>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                No tasks available. Create your first task to see priority tracking here.
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution Pie Chart (Right side - 1 col) */}
        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800/90 shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-indigo-400" />
              Status Breakdown
            </h2>
            <span className="text-[10px] font-medium text-slate-500 bg-[#0d131f] px-2 py-0.5 rounded border border-slate-800">
              {totalTasks} total
            </span>
          </div>

          {/* SVG Donut / Pie Chart */}
          <div className="relative flex items-center justify-center py-2">
            <svg viewBox="0 0 100 100" className="w-40 h-40 -rotate-90 transform">
              {totalTasks === 0 ? (
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-800"
                  strokeWidth="14"
                  fill="none"
                />
              ) : (
                <>
                  {/* Segment: Completed */}
                  {completedTasks > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray={`${(completedTasks / totalTasks) * 238.76} 238.76`}
                      strokeDashoffset="0"
                      fill="none"
                      className="transition-all duration-700 hover:opacity-85"
                    />
                  )}
                  {/* Segment: In Progress */}
                  {inProgressTasks > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#6366f1"
                      strokeWidth="14"
                      strokeDasharray={`${(inProgressTasks / totalTasks) * 238.76} 238.76`}
                      strokeDashoffset={`-${(completedTasks / totalTasks) * 238.76}`}
                      fill="none"
                      className="transition-all duration-700 hover:opacity-85"
                    />
                  )}
                  {/* Segment: Pending / On Hold */}
                  {pendingTasks > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeDasharray={`${(pendingTasks / totalTasks) * 238.76} 238.76`}
                      strokeDashoffset={`-${((completedTasks + inProgressTasks) / totalTasks) * 238.76}`}
                      fill="none"
                      className="transition-all duration-700 hover:opacity-85"
                    />
                  )}
                  {/* Segment: Blocked / Not Start */}
                  {blockedTasks > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#f43f5e"
                      strokeWidth="14"
                      strokeDasharray={`${(blockedTasks / totalTasks) * 238.76} 238.76`}
                      strokeDashoffset={`-${((completedTasks + inProgressTasks + pendingTasks) / totalTasks) * 238.76}`}
                      fill="none"
                      className="transition-all duration-700 hover:opacity-85"
                    />
                  )}
                </>
              )}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white leading-none">
                {totalTasks > 0 ? `${completionRate}%` : '0%'}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">
                Done
              </span>
            </div>
          </div>

          {/* Color Legend Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d131f] border border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300 text-[11px]">Completed</span>
              </div>
              <span className="font-semibold text-emerald-400 text-[11px]">{completedTasks}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d131f] border border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-slate-300 text-[11px]">In Progress</span>
              </div>
              <span className="font-semibold text-indigo-400 text-[11px]">{inProgressTasks}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d131f] border border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300 text-[11px]">On Hold</span>
              </div>
              <span className="font-semibold text-amber-400 text-[11px]">{pendingTasks}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d131f] border border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300 text-[11px]">Not Start</span>
              </div>
              <span className="font-semibold text-rose-400 text-[11px]">{blockedTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
