'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoan } from '../../../hooks/useLoan';
import { paymentSchema } from '../../../lib/validations';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import { LoanStatus } from '@lms/shared/src/types/loan.types';
import api from '../../../lib/api';

interface ActiveLoan {
  id: string;
  borrower?: {
    fullName: string;
    email: string;
  };
  amount: number;
  tenureDays: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: LoanStatus;
}

interface PaymentHistoryItem {
  id: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  notes?: string;
}

type PaymentFormValues = {
  utrNumber: string;
  amount: number;
  paymentDate: string;
  notes?: string;
};

export default function CollectionPage() {
  const { getLoans, recordPayment, getLoanById, loading: globalLoading, error: globalError } = useLoan();
  const [loans, setLoans] = useState<ActiveLoan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<ActiveLoan | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      utrNumber: '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const fetchLoansData = async (activePage: number) => {
    try {
      const response = await getLoans(LoanStatus.DISBURSED, activePage, 10);
      setLoans(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Failed to get collection loans:', err);
    }
  };

  useEffect(() => {
    fetchLoansData(page);
  }, [page]);

  const loadLoanDetails = async (loan: ActiveLoan) => {
    try {
      const details = await getLoanById(loan.id);
      setSelectedLoan(details.loan);
      setPaymentHistory(details.payments);
      setFormError(null);
      setFormSuccess(null);
      reset({
        utrNumber: '',
        amount: details.loan.outstandingBalance,
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  };

  const handleRecordPayment = async (data: PaymentFormValues) => {
    if (!selectedLoan) return;
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const result = await recordPayment({
        loanId: selectedLoan.id,
        utrNumber: data.utrNumber.trim(),
        amount: Number(data.amount),
        paymentDate: new Date(data.paymentDate).toISOString(),
        notes: data.notes,
      });

      setFormSuccess('Payment transaction recorded successfully.');
      
      // Update details drawer and primary list
      await loadLoanDetails(result.loan);
      await fetchLoansData(page);
      
      // Clear drawer if auto-closed
      if (result.loan.status === LoanStatus.CLOSED) {
        setSelectedLoan(null);
        alert(`Loan settled and auto-closed! UTR: ${data.utrNumber}`);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Transaction submission failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      header: 'Borrower',
      accessor: (row: ActiveLoan) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-100">{row.borrower?.fullName || 'Test Borrower'}</span>
          <span className="text-[10px] text-slate-500 font-semibold">{row.borrower?.email}</span>
        </div>
      ),
    },
    {
      header: 'Total Repayment',
      accessor: (row: ActiveLoan) => <span className="font-bold text-slate-100">Rs. {row.totalRepayment.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Total Paid',
      accessor: (row: ActiveLoan) => <span className="font-bold text-emerald-400">Rs. {row.totalPaid.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Outstanding Balance',
      accessor: (row: ActiveLoan) => {
        const outstanding = Math.max(0, row.totalRepayment - row.totalPaid);
        return <span className="font-extrabold text-rose-400">Rs. {outstanding.toLocaleString('en-IN')}</span>;
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (row: ActiveLoan) => (
        <Button
          variant="outline"
          onClick={() => loadLoanDetails(row)}
          className="px-3 py-1.5 text-xs font-semibold"
        >
          Collect Payment
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-widest">
            Loan Collection Board
          </h1>
          <p className="text-xs text-slate-400">Monitor disbursed credit lines, reconcile transaction installments, and record UTR bank payments</p>
        </div>
      </div>

      {globalError && (
        <div className="p-4 bg-rose-950/40 border border-rose-900/40 rounded-lg text-xs font-semibold text-rose-400 tracking-wide">
          {globalError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Loans Table */}
        <div className="lg:col-span-2 space-y-6">
          <Table
            columns={columns}
            data={loans}
            loading={globalLoading}
            emptyMessage="No active disbursed loans in collection."
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
                  disabled={page <= 1 || globalLoading}
                  onClick={() => setPage(prev => prev - 1)}
                  className="text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages || globalLoading}
                  onClick={() => setPage(prev => prev + 1)}
                  className="text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Loan Details & Payment Drawer Panel */}
        <div className="lg:col-span-1">
          {selectedLoan ? (
            <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-100 text-sm">Collection Panel</h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                    Account #{selectedLoan.id.slice(-8)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Financial metrics */}
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500 uppercase tracking-wider">Repayment Sum:</span>
                  <span className="text-slate-200">Rs. {selectedLoan.totalRepayment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500 uppercase tracking-wider">Total Received:</span>
                  <span className="text-emerald-400">Rs. {selectedLoan.totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold border-t border-slate-850 pt-2">
                  <span className="text-slate-400 uppercase tracking-wider text-xs">Outstanding Balance:</span>
                  <span className="text-rose-400">Rs. {selectedLoan.outstandingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment recording form */}
              <form onSubmit={handleSubmit(handleRecordPayment)} className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Record Bank Receipt
                </h4>

                {formError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-900/40 rounded-lg text-xs font-semibold text-rose-400 leading-normal">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-lg text-xs font-semibold text-emerald-400 leading-normal">
                    {formSuccess}
                  </div>
                )}

                <Input
                  label="UTR Reference Number (Unique)"
                  type="text"
                  placeholder="e.g. UTR12345678"
                  error={errors.utrNumber?.message}
                  {...register('utrNumber')}
                  disabled={formLoading}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Amount (INR)"
                    type="number"
                    step="0.01"
                    error={errors.amount?.message}
                    {...register('amount')}
                    disabled={formLoading}
                  />

                  <Input
                    label="Receipt Date"
                    type="date"
                    error={errors.paymentDate?.message}
                    {...register('paymentDate')}
                    disabled={formLoading}
                  />
                </div>

                <Input
                  label="Additional Notes (Optional)"
                  type="text"
                  placeholder="e.g. Online bank transfer"
                  error={errors.notes?.message}
                  {...register('notes')}
                  disabled={formLoading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={formLoading}
                >
                  Record Payment Installment
                </Button>
              </form>

              {/* Installments History */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Installments History
                </h4>
                {paymentHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 font-semibold tracking-wide italic">No payments registered on this account.</p>
                ) : (
                  <div className="max-h-[160px] overflow-y-auto space-y-2 border border-slate-850 rounded-xl p-2 bg-slate-950/20">
                    {paymentHistory.map((item) => (
                      <div key={item.id} className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg flex justify-between items-center gap-2">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">UTR: {item.utrNumber}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">
                            {new Date(item.paymentDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">Rs. {item.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-850 p-8 text-center text-slate-500 text-xs font-semibold tracking-wide italic">
              Select a borrower account from the table list to record payments and check transaction history sheets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
