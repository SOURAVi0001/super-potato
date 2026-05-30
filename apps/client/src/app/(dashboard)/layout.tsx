'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import useAuthStore from '../../store/authStore';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import { UserRole } from '@lms/shared/src/types/user.types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { fetchMe } = useAuth();
  const [loading, setLoading] = useState(!user);
  const router = useRouter();

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Syncing executive session...</p>
        </div>
      </div>
    );
  }

  // Deny access to borrowers trying to enter dashboard layouts
  if (user && user.role === UserRole.BORROWER) {
    router.replace('/unauthorized');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
