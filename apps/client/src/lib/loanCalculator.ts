export interface LoanCalculation {
  principal: number;
  ratePerAnnum: number;
  tenureDays: number;
  simpleInterest: number;
  totalRepayment: number;
}

// Formula from assignment:
// SI = (P × R × T) / (365 × 100)   where T = tenure in days, R = 12 (fixed)
// Total Repayment = P + SI

export function calculateLoan(principal: number, tenureDays: number): LoanCalculation {
  const ratePerAnnum = 12;
  const rawSI = (principal * ratePerAnnum * tenureDays) / (365 * 100);
  const simpleInterest = Math.round(rawSI * 100) / 100;
  const totalRepayment = Math.round((principal + simpleInterest) * 100) / 100;

  return {
    principal,
    ratePerAnnum,
    tenureDays,
    simpleInterest,
    totalRepayment,
  };
}
