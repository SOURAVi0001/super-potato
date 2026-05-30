import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { sendSuccess, sendError } from '../../utils/apiResponse';

export class PaymentController {
  static async recordPayment(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { loanId, utrNumber, amount, paymentDate, notes } = req.body;

    if (!loanId || !utrNumber || amount === undefined || !paymentDate) {
      return sendError(res, 'Missing required payment parameters', 400);
    }

    const result = await PaymentService.recordPayment(req.user.id, {
      loanId,
      utrNumber,
      amount: Number(amount),
      paymentDate,
      notes,
    });

    return sendSuccess(res, result, 201);
  }

  static async getPaymentsByLoanId(req: Request, res: Response) {
    const { loanId } = req.params;
    const payments = await PaymentService.getPaymentsByLoanId(loanId);
    return sendSuccess(res, payments, 200);
  }
}
export default PaymentController;
