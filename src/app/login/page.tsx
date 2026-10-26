'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/context/TaskContext';
import { Lock, Mail, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useTasks();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-8 px-4 bg-[#0b0f19]">
      <div className="w-full max-w-sm space-y-6 bg-[#111827] p-6 sm:p-7 rounded-2xl shadow-2xl shadow-black/60 border border-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30 mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Sign in to TaskRecord</h2>
          <p className="mt-1 text-xs text-slate-400">
            Access your tasks, analytics, and active sprints
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="block w-full pl-9 pr-3 py-2 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <a href="#" className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300">
                  Forgot?
                </a>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2 bg-[#0d131f] border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                Sign in
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 pt-1">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
