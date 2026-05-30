'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import useAuthStore from '../../store/authStore';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import { UserRole } from '@lms/shared/src/types/user.types';

export default function BorrowerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { fetchMe } = useAuth();
  const [loading, setLoading] = useState(!user);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      if (!user) {
        try {
          await fetchMe();
        } catch (err) {
          router.replace('/login');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    restoreSession();
  }, [user, fetchMe, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] text-stone-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest font-bold text-stone-400">Syncing Borrower Session...</p>
        </div>
      </div>
    );
  }

  // Double check role constraints in sync memory
  if (user && user.role !== UserRole.BORROWER) {
    router.replace('/unauthorized');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#faf9f7] text-stone-800">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
