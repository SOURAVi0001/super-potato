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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Syncing loan information...</p>
        </div>
      </div>
    );
  }

  const application = data?.application;
  const loan = data?.loan;

  // Case 1: No application found at all
  if (!application) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-6">
            <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-widest mb-2">No Active Loans</h1>
          <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
            You haven't submitted any loan requests yet. Complete our quick multi-step process to check your eligibility.
          </p>
          <Link href="/apply" passHref>
            <Button variant="primary">
              Apply For A Loan
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
      <div className="max-w-2xl mx-auto py-8">
        <div className={`glass-panel p-8 rounded-2xl border text-center ${isFailed ? 'border-rose-950/40 shadow-[0_0_50px_rgba(244,63,94,0.05)]' : 'border-slate-800'}`}>
          <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-6 ${isFailed ? 'bg-rose-950/40 border-rose-800/60 text-rose-400' : 'bg-slate-900 border-slate-800 text-indigo-400'}`}>
            {isFailed ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </div>
          
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-widest mb-2">
            {isFailed ? 'Eligibility Rejected' : 'Application In Progress'}
          </h1>
          
          <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
            {isFailed
              ? 'Our Business Rule Engine rejected your application based on the submitted details. You are not eligible for a loan at this time.'
              : 'You have started your multi-step loan request. Resume the application wizard to complete your request.'}
          </p>

          {!isFailed && (
            <Link href="/apply" passHref>
              <Button variant="primary">
                Resume Application (Step {application.step})
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
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Rejection alert */}
      {loan.status === LoanStatus.REJECTED && (
        <div className="p-5 bg-rose-950/40 border border-rose-900/40 rounded-xl flex gap-4 items-start shadow-[0_0_30px_rgba(244,63,94,0.05)]">
          <div className="p-2 bg-rose-900/40 text-rose-400 rounded-lg shrink-0 border border-rose-800/60">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wider mb-1">Application Declined</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Your loan application has been rejected by our credit sanctioning team.
            </p>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Reason provided:</span>
              <p className="text-xs font-semibold text-slate-200">{loan.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Loan Details Panel */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Loan Reference</span>
            <span className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">#{loan.id.slice(-8)}</span>
          </div>
          <LoanStatusBadge status={loan.status} />
        </div>

        <div className="p-6 md:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Applied Principal</span>
            <h3 className="text-base md:text-lg font-bold text-slate-100">Rs. {loan.amount.toLocaleString('en-IN')}</h3>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Interest Charge</span>
            <h3 className="text-base md:text-lg font-bold text-indigo-400">Rs. {loan.simpleInterest.toLocaleString('en-IN')}</h3>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Repayment Term</span>
            <h3 className="text-base md:text-lg font-bold text-slate-100">{loan.tenureDays} Days</h3>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Total Repayment</span>
            <h3 className="text-base md:text-lg font-bold text-cyan-400">Rs. {loan.totalRepayment.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        {loan.status === LoanStatus.DISBURSED && (
          <div className="px-6 py-6 bg-slate-950/40 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Settled</span>
              <p className="text-sm font-semibold text-emerald-400">Rs. {loan.totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Outstanding Balance</span>
              <p className="text-sm font-extrabold text-rose-400">Rs. {outstanding.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex items-center">
              {/* Payment instructions warning */}
              <div className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-500 leading-normal">
                Make bank transfers referencing the loan reference. Installments are updated by Collections.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Repayment History logs */}
      {loan.status === LoanStatus.CLOSED && (
        <div className="p-6 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
          <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)] shrink-0 animate-pulse">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-1">Loan Settled & Closed</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your loan balance of Rs. {loan.totalRepayment.toLocaleString('en-IN')} has been settled in full. Thank you for choosing LMS!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
