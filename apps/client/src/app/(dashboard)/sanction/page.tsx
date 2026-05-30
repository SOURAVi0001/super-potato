'use client';

import React, { useEffect, useState } from 'react';
import { useLoan } from '../../../hooks/useLoan';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { LoanStatus } from '@lms/shared/src/types/loan.types';

interface SanctionLoan {
  id: string;
  applicationId: string;
  borrowerId: string;
  borrower?: {
    fullName: string;
    email: string;
  };
  amount: number;
  tenureDays: number;
  simpleInterest: number;
  totalRepayment: number;
  status: LoanStatus;
  salarySlipUrl?: string; // Hydrated in loan model or retrieved
}

export default function SanctionPage() {
  const { getLoans, approveLoan, rejectLoan, getLoanById, loading, error } = useLoan();
  const [loans, setLoans] = useState<SanctionLoan[]>([]);
  const [activeLoanId, setActiveLoanId] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLoansData = async (activePage: number) => {
    try {
      const response = await getLoans(LoanStatus.PENDING, activePage, 10);
      
      // Hydrate each loan with its respective salary slip path
      const hydratedLoans = await Promise.all(
        response.data.map(async (item: any) => {
          const detail = await getLoanById(item.id);
          const appDetails = detail.loan.applicationId;
          // Retrieve salarySlipUrl using lookups if populated
          return {
            ...item,
            salarySlipUrl: appDetails?.salarySlipUrl || detail.loan.salarySlipUrl || '',
          };
        })
      );

      setLoans(hydratedLoans);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Failed to get pending loans:', err);
    }
  };

  useEffect(() => {
    fetchLoansData(page);
  }, [page]);

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this loan application?')) return;
    try {
      await approveLoan(id);
      await fetchLoansData(page); // Refresh list
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!activeLoanId) return;
    await rejectLoan(activeLoanId, reason);
    await fetchLoansData(page); // Refresh list
  };

  const columns = [
    {
      header: 'Borrower',
      accessor: (row: SanctionLoan) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-100">{row.borrower?.fullName || 'Test Borrower'}</span>
          <span className="text-[10px] text-slate-500 font-semibold">{row.borrower?.email}</span>
        </div>
      ),
    },
    {
      header: 'Principal',
      accessor: (row: SanctionLoan) => <span className="font-bold text-slate-100">Rs. {row.amount.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Tenure',
      accessor: (row: SanctionLoan) => <span className="font-semibold text-slate-400">{row.tenureDays} Days</span>,
    },
    {
      header: 'Repayment Sum',
      accessor: (row: SanctionLoan) => <span className="font-extrabold text-cyan-400">Rs. {row.totalRepayment.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Salary Slip',
      accessor: (row: SanctionLoan) => {
        // Fetch or guess static path from backend
        const slipPath = row.salarySlipUrl || `uploads/salary-slip-mock.pdf`;
        const slipFullUrl = `http://localhost:5001/${slipPath}`;
        
        return (
          <a
            href={slipFullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Document
          </a>
        );
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (row: SanctionLoan) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="danger"
            onClick={() => {
              setActiveLoanId(row.id);
              setIsRejectModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs"
          >
            Reject
          </Button>
          <Button
            variant="accent"
            onClick={() => handleApprove(row.id)}
            className="px-3 py-1.5 text-xs"
          >
            Approve
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-widest">
            Loan Sanction Board
          </h1>
          <p className="text-xs text-slate-400">Review pending borrower loan applications, verify salary slips, and approve credit lines</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-900/40 rounded-lg text-xs font-semibold text-rose-400 tracking-wide">
          {error}
        </div>
      )}

      {/* Pending Applications table */}
      <Table
        columns={columns}
        data={loans}
        loading={loading}
        emptyMessage="No pending applications awaiting sanction reviews."
      />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-slate-900/20 px-6 py-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage(prev => prev - 1)}
              className="text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(prev => prev + 1)}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setActiveLoanId(null);
        }}
        onSubmit={handleRejectSubmit}
        title="Confirm Application Rejection"
        placeholder="Please enter a detailed explanation for declining this loan application (Required)..."
        submitLabel="Decline Application"
        submitVariant="danger"
      />
    </div>
  );
}
