'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLoan } from '../../../hooks/useLoan';
import { IApplication, ILoan, LoanStatus, ApplicationStatus } from '@lms/shared/src/types/loan.types';
import LoanStatusBadge from '../../../components/loan/LoanStatusBadge';
import Button from '../../../components/ui/Button';

export default function MyLoanPage() {
  const { getMyApplication, loading, error } = useLoan();
  const [data, setData] = useState<{ application: IApplication | null; loan: ILoan | null } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getMyApplication();
        setData(res);
      } catch (err) {
        console.error('Failed to load application data:', err);
      }
    }
    loadData();
  }, []);

  if (loading && !data) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[12px] font-medium text-stone-500">Syncing loan information...</p>
        </div>
      </div>
    );
  }

  const application = data?.application;
  const loan = data?.loan;

  // Case 1: No application found at all
  if (!application) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white border border-stone-200 rounded-lg p-8 text-center shadow-card">
          <div className="w-12 h-12 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 mx-auto mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-[17px] font-medium text-stone-900 mb-2">No active loans</h1>
          <p className="text-[13px] text-stone-500 mb-6 max-w-sm mx-auto leading-relaxed">
            You haven't submitted any loan requests yet. Complete our quick multi-step process to check your eligibility.
          </p>
          <Link href="/apply" passHref>
            <Button variant="primary" className="text-xs">
              Apply for a loan
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Application started but not submitted (DRAFT / BRE_FAILED)
  if (application && application.status !== ApplicationStatus.APPLIED) {
    const isFailed = application.status === ApplicationStatus.BRE_FAILED;
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className={`bg-white border rounded-lg p-8 text-center shadow-card ${isFailed ? 'border-[#d4a898]' : 'border-stone-200'}`}>
          <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mx-auto mb-4 ${isFailed ? 'bg-[#f5ebe8] border-[#d4a898] text-[#7a2e20]' : 'bg-stone-50 border-stone-200 text-brand-600'}`}>
            {isFailed ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </div>
          
          <h1 className="text-[17px] font-medium text-stone-900 mb-2">
            {isFailed ? 'Eligibility rejected' : 'Application in progress'}
          </h1>
          
          <p className="text-[13px] text-stone-500 mb-6 max-w-sm mx-auto leading-relaxed">
            {isFailed
              ? 'Our Business Rule Engine rejected your application based on the submitted details. You are not eligible for a loan at this time.'
              : 'You have started your multi-step loan request. Resume the application wizard to complete your request.'}
          </p>

          {!isFailed && (
            <Link href="/apply" passHref>
              <Button variant="primary" className="text-xs">
                Resume application (Step {application.step})
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Case 3: Loan submitted (APPLIED)
  if (!loan) return null;

  const outstanding = Math.max(0, Math.round((loan.totalRepayment - loan.totalPaid) * 100) / 100);

  return (
    <div className="max-w-3xl mx-auto space-y-5 py-4 px-4">
      {/* Rejection alert */}
      {loan.status === LoanStatus.REJECTED && (
        <div className="p-5 bg-[#f5ebe8] border border-[#d4a898] rounded-lg flex gap-3.5 items-start">
          <div className="p-1.5 bg-white text-[#7a2e20] rounded border border-[#d4a898] shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-[13px] font-medium text-[#7a2e20] mb-1">Application declined</h4>
            <p className="text-[12px] text-stone-500 leading-relaxed mb-3">
              Your loan application has been rejected by our credit sanctioning team.
            </p>
            <div className="bg-white p-3 rounded border border-[#d4a898] bg-[#fdfcfa]">
              <span className="text-[11px] font-medium text-stone-500 block mb-0.5">Reason provided:</span>
              <p className="text-[12px] font-normal text-[#7a2e20]">{loan.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Loan Details Panel */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/50 flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-[11px] font-medium text-stone-400 block mb-0.5">Loan reference</span>
            <span className="font-medium text-[13px] text-stone-800">#{loan.id.slice(-8).toUpperCase()}</span>
          </div>
          <LoanStatusBadge status={loan.status} />
        </div>

        <div className="p-5 md:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          <div>
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Applied principal</span>
            <h3 className="text-[15px] font-medium text-stone-900">Rs. {loan.amount.toLocaleString('en-IN')}</h3>
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Interest charge</span>
            <h3 className="text-[15px] font-medium text-brand-600">Rs. {loan.simpleInterest.toLocaleString('en-IN')}</h3>
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Repayment term</span>
            <h3 className="text-[15px] font-medium text-stone-900">{loan.tenureDays} Days</h3>
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Total repayment</span>
            <h3 className="text-[15px] font-medium text-stone-900">Rs. {loan.totalRepayment.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        {loan.status === LoanStatus.DISBURSED && (
          <div className="px-5 py-5 bg-stone-50/50 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] font-medium text-stone-500 block mb-0.5">Total settled</span>
              <p className="text-[13px] font-medium text-[#2d5c2a]">Rs. {loan.totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 block mb-0.5">Outstanding balance</span>
              <p className="text-[13px] font-medium text-[#7a2e20]">Rs. {outstanding.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex items-center">
              {/* Payment instructions warning */}
              <div className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded text-[11px] font-normal text-stone-500 leading-normal">
                Make bank transfers referencing the loan ID. Installments are updated by Collections.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Repayment History logs */}
      {loan.status === LoanStatus.CLOSED && (
        <div className="p-5 bg-[#edf3ec] border border-[#a8c8a4] rounded-lg flex items-center gap-3.5">
          <div className="w-10 h-10 bg-white border border-[#a8c8a4] text-[#2d5c2a] rounded flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-[13px] font-medium text-[#2d5c2a] mb-0.5">Loan settled & closed</h4>
            <p className="text-[12px] text-stone-500 leading-relaxed">
              Your loan balance of Rs. {loan.totalRepayment.toLocaleString('en-IN')} has been settled in full. Thank you for choosing LMS!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
