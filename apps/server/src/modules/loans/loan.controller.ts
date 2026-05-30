import { Request, Response } from 'express';
import { LoanService } from './loan.service';
import { sendSuccess, sendError } from '../../utils/apiResponse';
import { UserRole } from '@lms/shared/src/types/user.types';

export class LoanController {
  static async getLoans(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const status = req.query.status as string;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);

    const { loans, meta } = await LoanService.getLoans(
      req.user.role as UserRole,
      status,
      page,
      limit
    );

    return sendSuccess(res, loans, 200, meta);
  }

  static async getLoanById(req: Request, res: Response) {
    const { id } = req.params;
    const data = await LoanService.getLoanById(id);
    return sendSuccess(res, data, 200);
  }

  static async approve(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { id } = req.params;
    const loan = await LoanService.approveLoan(id, req.user.id);
    return sendSuccess(res, loan, 200);
  }

  static async reject(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { id } = req.params;
    const { reason } = req.body;

    const loan = await LoanService.rejectLoan(id, req.user.id, reason);
    return sendSuccess(res, loan, 200);
  }

  static async disburse(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { id } = req.params;
    const loan = await LoanService.disburseLoan(id, req.user.id);
    return sendSuccess(res, loan, 200);
  }
}
export default LoanController;
