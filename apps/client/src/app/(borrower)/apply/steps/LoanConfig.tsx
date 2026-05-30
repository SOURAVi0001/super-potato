'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoan } from '../../../../hooks/useLoan';
import useApplicationStore from '../../../../store/applicationStore';
import LoanCalculator from '../../../../components/loan/LoanCalculator';
import Button from '../../../../components/ui/Button';

export default function LoanConfig() {
  const { saveLoanConfig, submitApplication, loading } = useLoan();
  const { loanConfig, setLoanConfig, setStep, resetWizard } = useApplicationStore();
  const router = useRouter();

  // Initialize sliders with previous parameters or standard defaults
  const [amount, setAmount] = useState(loanConfig?.amount || 100000);
  const [tenure, setTenure] = useState(loanConfig?.tenureDays || 180);

  const handleApply = async () => {
    try {
      // 1. Submit loan configuration inputs to the server first
      const configRes = await saveLoanConfig({ amount, tenureDays: tenure });
      setLoanConfig(configRes.loanConfig);

      // 2. Formally submit the full borrower application
      await submitApplication();

      // 3. Reset persistent wizard cache and redirect
      resetWizard();
      router.push('/my-loan');
    } catch (err) {
      console.error('Final loan application submission failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-widest mb-1">
            Configure Loan Request
          </h2>
          <p className="text-xs text-slate-400">Step 4: Personalize principal amounts and tenure limits</p>
        </div>
        <div className="bg-indigo-950/30 border border-indigo-800/40 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.1)]">
          Slip Uploaded
        </div>
      </div>

      <div className="space-y-6">
        {/* Loan Amount Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Loan Amount Limit</span>
            <span className="text-sm font-extrabold text-slate-100">
              Rs. {amount.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={500000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={loading}
            className="w-full cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
            <span>Rs. 50K</span>
            <span>Rs. 5L</span>
          </div>
        </div>

        {/* Tenure Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Repayment Tenure</span>
            <span className="text-sm font-extrabold text-slate-100">{tenure} Days</span>
          </div>
          <input
            type="range"
            min={30}
            max={365}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            disabled={loading}
            className="w-full cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
            <span>30 Days</span>
            <span>365 Days</span>
          </div>
        </div>

        {/* Autoritative real-time display panel */}
        <LoanCalculator amount={amount} tenureDays={tenure} />

        {/* Wizard controls */}
        <div className="pt-4 border-t border-slate-850 flex justify-between items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setStep(3)}
            disabled={loading}
            className="text-xs"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Upload
          </Button>

          <Button
            variant="accent"
            isLoading={loading}
            onClick={handleApply}
          >
            Submit & Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
