import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TaskProvider } from '@/context/TaskContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskRecord | Modern Dark Task Management',
  description: 'Track, organize, and monitor your personal and team tasks with Next.js and FastAPI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white`}>
        <TaskProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-800/80 bg-[#0e1424] py-4 text-center text-xs text-slate-400">
              <div className="max-w-7xl mx-auto px-4">
                TaskRecord &copy; 2026                
              </div>
            </footer>
          </div>
        </TaskProvider>
      </body>
    </html>
  );
}
