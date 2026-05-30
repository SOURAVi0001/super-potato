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
          <h2 className="text-[15px] font-medium text-stone-900 mb-1">
            Configure loan request
          </h2>
          <p className="text-[12px] text-stone-400">Step 3: Personalize principal amounts and tenure limits</p>
        </div>
        <div className="bg-[#eaeff5] text-[#1e3d5c] border border-[#98b4cc] text-[11px] font-medium px-2 py-0.5 rounded shadow-sm">
          Slip Uploaded
        </div>
      </div>

      <div className="space-y-6">
        {/* Loan Amount Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[13px] font-medium text-stone-600">
            <span>Loan amount limit</span>
            <span className="text-[14px] font-medium text-stone-900">
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
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-normal text-stone-400">
            <span>Rs. 50K</span>
            <span>Rs. 5L</span>
          </div>
        </div>

        {/* Tenure Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[13px] font-medium text-stone-600">
            <span>Repayment tenure</span>
            <span className="text-[14px] font-medium text-stone-900">{tenure} Days</span>
          </div>
          <input
            type="range"
            min={30}
            max={365}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            disabled={loading}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-normal text-stone-400">
            <span>30 Days</span>
            <span>365 Days</span>
          </div>
        </div>

        {/* Autoritative real-time display panel */}
        <LoanCalculator amount={amount} tenureDays={tenure} />

        {/* Wizard controls */}
        <div className="pt-4 border-t border-stone-200 flex justify-between items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setStep(2)}
            disabled={loading}
            className="text-xs"
          >
            <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to upload
          </Button>

          <Button
            variant="primary"
            isLoading={loading}
            onClick={handleApply}
            className="text-xs"
          >
            Submit & apply
          </Button>
        </div>
      </div>
    </div>
  );
}
