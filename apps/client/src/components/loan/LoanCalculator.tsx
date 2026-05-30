import React from 'react';
import { calculateLoan } from '../../lib/loanCalculator';

interface LoanCalculatorProps {
  amount: number;
  tenureDays: number;
}

export function LoanCalculator({ amount, tenureDays }: LoanCalculatorProps) {
  const calc = calculateLoan(amount, tenureDays);

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-md">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        Live Calculation Panel
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm border-b border-slate-850 pb-2">
          <span className="text-slate-400 font-medium">Principal Amount</span>
          <span className="text-slate-100 font-semibold">Rs. {amount.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center text-sm border-b border-slate-850 pb-2">
          <span className="text-slate-400 font-medium">Interest Rate</span>
          <span className="text-emerald-400 font-semibold">12% p.a. (Fixed)</span>
        </div>

        <div className="flex justify-between items-center text-sm border-b border-slate-850 pb-2">
          <span className="text-slate-400 font-medium">Tenure</span>
          <span className="text-slate-100 font-semibold">{tenureDays} Days</span>
        </div>

        <div className="flex justify-between items-center text-sm border-b border-slate-850 pb-2">
          <span className="text-slate-400 font-medium">Simple Interest</span>
          <span className="text-indigo-400 font-semibold">Rs. {calc.simpleInterest.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center text-base pt-2">
          <span className="text-slate-300 font-bold">Total Repayment</span>
          <span className="text-cyan-400 font-extrabold text-lg">
            Rs. {calc.totalRepayment.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
export default LoanCalculator;
