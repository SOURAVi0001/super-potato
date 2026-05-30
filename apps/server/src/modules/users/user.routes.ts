import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '@lms/shared/src/types/user.types';
import { asyncWrapper } from '../../utils/asyncWrapper';

const router = Router();

router.get(
  '/leads',
  authenticate,
  authorize([UserRole.SALES, UserRole.ADMIN]),
  asyncWrapper(UserController.getLeads)
);

export default router;
