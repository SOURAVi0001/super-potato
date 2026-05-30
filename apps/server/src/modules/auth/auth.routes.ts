import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/authenticate';
import { asyncWrapper } from '../../utils/asyncWrapper';

const router = Router();

router.post('/register', asyncWrapper(AuthController.register));
router.post('/login', asyncWrapper(AuthController.login));
router.post('/refresh', asyncWrapper(AuthController.refresh));
router.post('/logout', asyncWrapper(AuthController.logout));

router.get('/me', authenticate, asyncWrapper(AuthController.me));

export default router;
