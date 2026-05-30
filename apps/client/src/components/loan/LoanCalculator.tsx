import React from 'react';
import { calculateLoan } from '../../lib/loanCalculator';

interface LoanCalculatorProps {
  amount: number;
  tenureDays: number;
}

export function LoanCalculator({ amount, tenureDays }: LoanCalculatorProps) {
  const calc = calculateLoan(amount, tenureDays);

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 shadow-sm">
      <h3 className="text-[13px] font-medium text-stone-600 mb-4">Loan summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-stone-500">Principal amount</span>
          <span className="text-[14px] text-stone-800 font-medium">Rs. {amount.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[13px] text-stone-500">Interest (12% p.a. Fixed)</span>
          <span className="text-[14px] text-stone-800">Rs. {calc.simpleInterest.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[13px] text-stone-500">Tenure</span>
          <span className="text-[14px] text-stone-800 font-medium">{tenureDays} Days</span>
        </div>

        <div className="h-px bg-stone-200 my-1" />

        <div className="flex justify-between items-center">
          <span className="text-[13px] text-stone-750 font-medium">Total repayment</span>
          <span className="text-[17px] text-stone-900 font-medium">
            Rs. {calc.totalRepayment.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
export default LoanCalculator;
