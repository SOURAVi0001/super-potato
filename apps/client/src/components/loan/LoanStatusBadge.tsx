import React from 'react';
import Badge from '../ui/Badge';
import { LoanStatus } from '@lms/shared/src/types/loan.types';

interface LoanStatusBadgeProps {
  status: LoanStatus;
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const map: Record<LoanStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
    [LoanStatus.PENDING]: 'warning',
    [LoanStatus.APPROVED]: 'primary',
    [LoanStatus.REJECTED]: 'danger',
    [LoanStatus.DISBURSED]: 'info',
    [LoanStatus.CLOSED]: 'success',
  };

  return (
    <Badge variant={map[status]}>
      {status}
    </Badge>
  );
}
export default LoanStatusBadge;
