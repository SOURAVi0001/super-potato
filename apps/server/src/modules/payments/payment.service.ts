import Payment from './payment.model';
import Loan from '../loans/loan.model';
import { LoanStatus } from '@lms/shared/src/types/loan.types';

export class PaymentService {
  static async recordPayment(
    recordedBy: string,
    payload: {
      loanId: string;
      utrNumber: string;
      amount: number;
      paymentDate: string;
      notes?: string;
    }
  ) {
    const { loanId, utrNumber, amount, paymentDate, notes } = payload;

    // 1. Verify loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      const error: any = new Error('Loan not found');
      error.statusCode = 404;
      throw error;
    }

    // 2. Validate active outstanding state
    if (loan.status !== LoanStatus.DISBURSED) {
      const error: any = new Error('Loan status must be DISBURSED');
      error.statusCode = 400;
      throw error;
    }

    // 3. Enforce absolute UTR uniqueness
    const existingPayment = await Payment.findOne({ utrNumber: utrNumber.trim() });
    if (existingPayment) {
      const error: any = new Error('UTR number already used in another payment');
      error.statusCode = 400;
      throw error;
    }

    // 4. Validate positive amounts
    if (amount <= 0) {
      const error: any = new Error('Amount must be greater than zero');
      error.statusCode = 400;
      throw error;
    }

    // 5. Limit payments to exact active outstanding limits
    const currentOutstanding = Math.round((loan.totalRepayment - loan.totalPaid) * 100) / 100;
    if (amount > currentOutstanding) {
      const error: any = new Error(`Amount exceeds outstanding balance of Rs. ${currentOutstanding}`);
      error.statusCode = 400;
      throw error;
    }

    // Create installment
    const payment = new Payment({
      loanId,
      borrowerId: loan.borrowerId,
      recordedBy,
      utrNumber: utrNumber.trim(),
      amount,
      paymentDate: new Date(paymentDate),
      notes,
    });

    await payment.save();

    // Re-tally full payments for this loan
    const paymentsForLoan = await Payment.find({ loanId });
    const sumPaid = paymentsForLoan.reduce((sum, pay) => sum + pay.amount, 0);
    loan.totalPaid = Math.round(sumPaid * 100) / 100;

    // Trigger auto-closure once balance is settled
    const remainingOutstanding = Math.round((loan.totalRepayment - loan.totalPaid) * 100) / 100;
    if (remainingOutstanding <= 0) {
      loan.status = LoanStatus.CLOSED;
      loan.closedAt = new Date();
    }

    await loan.save();

    return {
      payment,
      loan,
    };
  }

  static async getPaymentsByLoanId(loanId: string) {
    const loanExists = await Loan.exists({ _id: loanId });
    if (!loanExists) {
      const error: any = new Error('Loan not found');
      error.statusCode = 404;
      throw error;
    }
    return Payment.find({ loanId }).sort({ createdAt: -1 });
  }
}
export default PaymentService;
