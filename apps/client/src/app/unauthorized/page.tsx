'use client';

import React from 'react';
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
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-4">
      <div className="max-w-sm w-full text-center bg-white border border-[#d4a898] p-8 rounded-lg shadow-card">
        <div className="w-12 h-12 bg-[#f5ebe8] border border-[#d4a898] text-[#7a2e20] rounded flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-[17px] font-medium text-stone-900 mb-2">
          Access denied
        </h1>
        <p className="text-[13px] text-stone-500 mb-6 leading-relaxed">
          You do not have the required role privileges to access this private section of the Loan Management Portal.
        </p>

        <Link href={getRedirectPath()} passHref>
          <Button variant="danger" className="w-full text-xs">
            Return to portal home
          </Button>
        </Link>
      </div>
    </div>
  );
}
