import { Router } from 'express';
import { ApplicationController } from './application.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '@lms/shared/src/types/user.types';
import { upload } from '../../config/multer';
import { asyncWrapper } from '../../utils/asyncWrapper';

const router = Router();

// Gated routes for BORROWER only
router.post(
  '/personal-details',
  authenticate,
  authorize([UserRole.BORROWER]),
  asyncWrapper(ApplicationController.savePersonalDetails)
);

router.post(
  '/salary-slip',
  authenticate,
  authorize([UserRole.BORROWER]),
  upload.single('salarySlip'),
  asyncWrapper(ApplicationController.saveSalarySlip)
);

router.get(
  '/:id/salary-slip',
  asyncWrapper(ApplicationController.getSalarySlip)
);

router.post(
  '/loan-config',
  authenticate,
  authorize([UserRole.BORROWER]),
  asyncWrapper(ApplicationController.saveLoanConfig)
);

router.post(
  '/submit',
  authenticate,
  authorize([UserRole.BORROWER]),
  asyncWrapper(ApplicationController.submitApplication)
);

router.get(
  '/mine',
  authenticate,
  authorize([UserRole.BORROWER]),
  asyncWrapper(ApplicationController.getMine)
);

export default router;
