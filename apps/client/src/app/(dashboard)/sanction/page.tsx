'use client';

import React, { useEffect, useState } from 'react';
import { useLoan } from '../../../hooks/useLoan';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { LoanStatus } from '@lms/shared/src/types/loan.types';
import { SERVER_URL } from '../../../lib/api';

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
          <span className="font-medium text-stone-900">{row.borrower?.fullName || 'Test Borrower'}</span>
          <span className="text-[11px] text-stone-400 font-normal">{row.borrower?.email}</span>
        </div>
      ),
    },
    {
      header: 'Principal',
      accessor: (row: SanctionLoan) => <span className="font-medium text-stone-800">Rs. {row.amount.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Tenure',
      accessor: (row: SanctionLoan) => <span className="font-normal text-stone-500">{row.tenureDays} Days</span>,
    },
    {
      header: 'Repayment sum',
      accessor: (row: SanctionLoan) => <span className="font-medium text-stone-900">Rs. {row.totalRepayment.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Salary slip',
      accessor: (row: SanctionLoan) => {
        // Fetch or guess static path from backend
        const slipPath = row.salarySlipUrl || `uploads/salary-slip-mock.pdf`;
        const slipFullUrl = `${SERVER_URL}/${slipPath}`;
        
        return (
          <a
            href={slipFullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[13px] font-medium text-brand-600 hover:text-brand-850 underline gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View document
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
            variant="primary"
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
    <div className="space-y-4">
      <div>
        <h1 className="text-[15px] font-medium text-stone-900">
          Loan sanction board
        </h1>
        <p className="text-[12px] text-stone-400">Review pending borrower loan applications, verify salary slips, and approve credit lines</p>
      </div>

      {error && (
        <div className="p-3 rounded bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
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
        <div className="flex justify-between items-center bg-stone-50 border border-stone-200 px-4 py-3 rounded-lg shadow-card">
          <span className="text-[11px] font-medium text-stone-500">
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
