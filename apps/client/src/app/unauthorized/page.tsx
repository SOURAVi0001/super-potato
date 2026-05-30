'use client';

import Link from 'next/link';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import { UserRole } from '@lms/shared/src/types/user.types';

export default function UnauthorizedPage() {
  const { user } = useAuthStore();

  const getRedirectPath = () => {
    if (!user) return '/login';
    if (user.role === UserRole.BORROWER) return '/my-loan';
    if (user.role === UserRole.DISBURSEMENT) return '/disbursement';
    return '/sales';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full text-center glass-panel p-8 rounded-2xl border border-rose-900/30 shadow-[0_0_50px_rgba(244,63,94,0.05)]">
        <div className="w-16 h-16 bg-rose-950/40 border border-rose-800/60 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-bounce">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-lg font-bold text-slate-100 uppercase tracking-widest mb-2">
          Access Denied
        </h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          You do not have the required role privileges to access this private section of the Loan Management Portal.
        </p>

        <Link href={getRedirectPath()} passHref>
          <Button variant="danger" className="w-full">
            Return to Portal Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
