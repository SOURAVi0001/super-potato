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
          <span className="font-medium text-stone-900">{row.borrower?.fullName || 'Test Borrower'}</span>
          <span className="text-[11px] text-stone-400 font-normal">{row.borrower?.email}</span>
        </div>
      ),
    },
    {
      header: 'Total repayment',
      accessor: (row: ActiveLoan) => <span className="font-medium text-stone-850">Rs. {row.totalRepayment.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Total paid',
      accessor: (row: ActiveLoan) => <span className="font-medium text-[#2d5c2a]">Rs. {row.totalPaid.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Outstanding balance',
      accessor: (row: ActiveLoan) => {
        const outstanding = Math.max(0, row.totalRepayment - row.totalPaid);
        return <span className="font-medium text-[#7a2e20]">Rs. {outstanding.toLocaleString('en-IN')}</span>;
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (row: ActiveLoan) => (
        <Button
          variant="secondary"
          onClick={() => loadLoanDetails(row)}
          className="px-3 py-1.5 text-xs"
        >
          Collect payment
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4 relative">
      <div>
        <h1 className="text-[15px] font-medium text-stone-900">
          Loan collection board
        </h1>
        <p className="text-[12px] text-stone-400">Monitor disbursed credit lines, reconcile transaction installments, and record UTR bank payments</p>
      </div>

      {globalError && (
        <div className="p-3 rounded bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
          {globalError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Loans Table */}
        <div className="lg:col-span-2 space-y-4">
          <Table
            columns={columns}
            data={loans}
            loading={globalLoading}
            emptyMessage="No active disbursed loans in collection."
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
            <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-5 shadow-card animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex justify-between items-center border-b border-stone-150 pb-3">
                <div>
                  <h3 className="font-medium text-stone-900 text-[14px]">Collection panel</h3>
                  <span className="text-[11px] font-normal text-stone-400 block mt-0.5">
                    Account #{selectedLoan.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Financial metrics summary */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-2.5">
                <div className="flex justify-between text-[12px]">
                  <span className="text-stone-500 font-normal">Repayment sum:</span>
                  <span className="text-stone-850 font-medium">Rs. {selectedLoan.totalRepayment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-stone-500 font-normal">Total received:</span>
                  <span className="text-[#2d5c2a] font-medium">Rs. {selectedLoan.totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[13px] border-t border-stone-200 pt-2 font-medium">
                  <span className="text-stone-600">Outstanding balance:</span>
                  <span className="text-[#7a2e20]">Rs. {selectedLoan.outstandingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment recording form */}
              <form onSubmit={handleSubmit(handleRecordPayment)} className="space-y-4">
                <h4 className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  Record bank receipt
                </h4>

                {formError && (
                  <div className="p-3 bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-[#edf3ec] border border-[#a8c8a4] text-[12px] font-medium text-[#2d5c2a]">
                    {formSuccess}
                  </div>
                )}

                <Input
                  label="UTR reference number (Unique)"
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
                    label="Receipt date"
                    type="date"
                    error={errors.paymentDate?.message}
                    {...register('paymentDate')}
                    disabled={formLoading}
                  />
                </div>

                <Input
                  label="Additional notes (Optional)"
                  type="text"
                  placeholder="e.g. Online bank transfer"
                  error={errors.notes?.message}
                  {...register('notes')}
                  disabled={formLoading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-xs"
                  isLoading={formLoading}
                >
                  Record payment installment
                </Button>
              </form>

              {/* Installments History */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  Installments history
                </h4>
                {paymentHistory.length === 0 ? (
                  <p className="text-[12px] text-stone-400 font-normal italic">No payments registered on this account.</p>
                ) : (
                  <div className="max-h-[160px] overflow-y-auto space-y-2 border border-stone-200 rounded-lg p-2 bg-stone-50/50">
                    {paymentHistory.map((item) => (
                      <div key={item.id} className="p-2 bg-white border border-stone-150 rounded flex justify-between items-center gap-2 shadow-sm">
                        <div>
                          <span className="text-[10px] font-medium text-stone-800 block">UTR: {item.utrNumber}</span>
                          <span className="text-[10px] text-stone-400 font-normal">
                            {new Date(item.paymentDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[12px] font-medium text-[#2d5c2a]">Rs. {item.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 text-center text-stone-400 text-[12px] font-normal italic">
              Select a borrower account from the table list to record payments and check transaction history sheets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
