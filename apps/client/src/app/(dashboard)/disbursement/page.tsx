'use client';

import React, { useEffect, useState } from 'react';
import { useLoan } from '../../../hooks/useLoan';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { LoanStatus } from '@lms/shared/src/types/loan.types';

interface ApprovedLoan {
  id: string;
  borrower?: {
    fullName: string;
    email: string;
  };
  amount: number;
  tenureDays: number;
  simpleInterest: number;
  totalRepayment: number;
  status: LoanStatus;
  sanctionedAt: string;
}

export default function DisbursementPage() {
  const { getLoans, disburseLoan, loading, error } = useLoan();
  const [loans, setLoans] = useState<ApprovedLoan[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLoansData = async (activePage: number) => {
    try {
      const response = await getLoans(LoanStatus.APPROVED, activePage, 10);
      setLoans(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Failed to get approved loans:', err);
    }
  };

  useEffect(() => {
    fetchLoansData(page);
  }, [page]);

  const handleDisburse = async (id: string) => {
    if (!confirm('Are you sure you want to release funds for this loan?')) return;
    try {
      await disburseLoan(id);
      await fetchLoansData(page); // Refresh list
    } catch (err) {
      console.error('Disburse failed:', err);
    }
  };

  const columns = [
    {
      header: 'Borrower',
      accessor: (row: ApprovedLoan) => (
        <div className="flex flex-col">
          <span className="font-medium text-stone-900">{row.borrower?.fullName || 'Test Borrower'}</span>
          <span className="text-[11px] text-stone-400 font-normal">{row.borrower?.email}</span>
        </div>
      ),
    },
    {
      header: 'Approved principal',
      accessor: (row: ApprovedLoan) => <span className="font-medium text-stone-800">Rs. {row.amount.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Repayment sum',
      accessor: (row: ApprovedLoan) => <span className="font-medium text-stone-900">Rs. {row.totalRepayment.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Sanctioned date',
      accessor: (row: ApprovedLoan) => (
        <span className="text-stone-500 font-normal">
          {new Date(row.sanctionedAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (row: ApprovedLoan) => (
        <Button
          variant="primary"
          onClick={() => handleDisburse(row.id)}
          className="px-3 py-1.5 text-xs"
        >
          Disburse funds
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[15px] font-medium text-stone-900">
          Loan disbursement board
        </h1>
        <p className="text-[12px] text-stone-400">Manage credit accounts in APPROVED state and dispatch principal bank transfers</p>
      </div>

      {error && (
        <div className="p-3 rounded bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
          {error}
        </div>
      )}

      {/* Approved Applications list */}
      <Table
        columns={columns}
        data={loans}
        loading={loading}
        emptyMessage="No approved applications awaiting disbursement operations."
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
    </div>
  );
}
