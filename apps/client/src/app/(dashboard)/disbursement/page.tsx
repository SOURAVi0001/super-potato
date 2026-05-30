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
          <span className="font-bold text-slate-100">{row.borrower?.fullName || 'Test Borrower'}</span>
          <span className="text-[10px] text-slate-500 font-semibold">{row.borrower?.email}</span>
        </div>
      ),
    },
    {
      header: 'Approved Principal',
      accessor: (row: ApprovedLoan) => <span className="font-bold text-slate-100">Rs. {row.amount.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Repayment Sum',
      accessor: (row: ApprovedLoan) => <span className="font-extrabold text-cyan-400">Rs. {row.totalRepayment.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Sanctioned Date',
      accessor: (row: ApprovedLoan) => (
        <span className="text-slate-400 font-medium">
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
          variant="accent"
          onClick={() => handleDisburse(row.id)}
          className="px-3 py-1.5 text-xs"
        >
          Disburse Funds
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-widest">
            Loan Disbursement Board
          </h1>
          <p className="text-xs text-slate-400">Manage credit accounts in APPROVED state and dispatch principal bank transfers</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-900/40 rounded-lg text-xs font-semibold text-rose-400 tracking-wide">
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
    </div>
  );
}
