'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  LayoutDashboard, 
  ListTodo, 
  Layers, 
  Calendar,
  Zap
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#0b0f19]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-tr from-indigo-600/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Record & Track Your Tasks with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Precision
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            A fast productivity workspace to manage task milestones, subtask checklists, and priority sprints without clutter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
            <Link
              href="/tasks/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <ListTodo className="w-4 h-4 text-indigo-400" />
              Create Task
            </Link>
          </div>
        </div>

        {/* 3 Compact Dark feature cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Live Metric Cards</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Real-time calculation of completion rate, urgent items, active sprints, and pending milestones.
            </p>
          </div>

          <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Compact Subtask Cards</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              All task information and subtasks fit within a clean, single card view without page scrolling.
            </p>
          </div>

          <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Timeline & Deadlines</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Stay ahead with start-to-end milestone dates, overdue warnings, and priority scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
