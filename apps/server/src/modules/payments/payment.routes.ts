import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '@lms/shared/src/types/user.types';
import { asyncWrapper } from '../../utils/asyncWrapper';

const router = Router();

// Record a new payment (collection and admin only)
router.post(
  '/',
  authenticate,
  authorize([UserRole.COLLECTION, UserRole.ADMIN]),
  asyncWrapper(PaymentController.recordPayment)
);

// Fetch full payment history for a specific loan
router.get(
  '/loan/:loanId',
  authenticate,
  authorize([UserRole.COLLECTION, UserRole.ADMIN]),
  asyncWrapper(PaymentController.getPaymentsByLoanId)
);

export default router;
