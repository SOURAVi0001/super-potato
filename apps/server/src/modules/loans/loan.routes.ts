import { Router } from 'express';
import { LoanController } from './loan.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '@lms/shared/src/types/user.types';
import { asyncWrapper } from '../../utils/asyncWrapper';

const router = Router();

// Retrieve all loans (role-filtered defaults are computed inside the service)
router.get(
  '/',
  authenticate,
  authorize([
    UserRole.ADMIN,
    UserRole.SALES,
    UserRole.SANCTION,
    UserRole.DISBURSEMENT,
    UserRole.COLLECTION,
  ]),
  asyncWrapper(LoanController.getLoans)
);

// Retrieve details for a single loan (borrower name and payment history populated)
router.get(
  '/:id',
  authenticate,
  authorize([
    UserRole.ADMIN,
    UserRole.SALES,
    UserRole.SANCTION,
    UserRole.DISBURSEMENT,
    UserRole.COLLECTION,
  ]),
  asyncWrapper(LoanController.getLoanById)
);

// Approve a loan (sanction or admin only)
router.patch(
  '/:id/approve',
  authenticate,
  authorize([UserRole.SANCTION, UserRole.ADMIN]),
  asyncWrapper(LoanController.approve)
);

// Reject a loan (sanction or admin only)
router.patch(
  '/:id/reject',
  authenticate,
  authorize([UserRole.SANCTION, UserRole.ADMIN]),
  asyncWrapper(LoanController.reject)
);

// Disburse a loan (disbursement or admin only)
router.patch(
  '/:id/disburse',
  authenticate,
  authorize([UserRole.DISBURSEMENT, UserRole.ADMIN]),
  asyncWrapper(LoanController.disburse)
);

export default router;
