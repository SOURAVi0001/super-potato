import React from 'react';
import { LoanStatus } from '@lms/shared/src/types/loan.types';

const STATUS_CONFIG = {
  [LoanStatus.PENDING]: {
    label: 'Pending',
    className: 'bg-[#f5f0e8] text-[#7a5c2e] border border-[#d4b896]',
  },
  [LoanStatus.APPROVED]: {
    label: 'Approved',
    className: 'bg-[#edf3ec] text-[#2d5c2a] border border-[#a8c8a4]',
  },
  [LoanStatus.REJECTED]: {
    label: 'Rejected',
    className: 'bg-[#f5ebe8] text-[#7a2e20] border border-[#d4a898]',
  },
  [LoanStatus.DISBURSED]: {
    label: 'Disbursed',
    className: 'bg-[#eaeff5] text-[#1e3d5c] border border-[#98b4cc]',
  },
  [LoanStatus.CLOSED]: {
    label: 'Closed',
    className: 'bg-[#f0ede8] text-[#5c4e3a] border border-[#c8b898]',
  },
} as const;

interface LoanStatusBadgeProps {
  status: LoanStatus;
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-stone-100 text-stone-600 border border-stone-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors duration-150 ${config.className}`}>
      {config.label}
    </span>
  );
}
export default LoanStatusBadge;
