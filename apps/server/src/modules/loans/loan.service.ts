import Loan from './loan.model';
import User from '../users/user.model';
import Application from '../applications/application.model';
import Payment from '../payments/payment.model';
import { LoanStatus } from '@lms/shared/src/types/loan.types';
import { UserRole } from '@lms/shared/src/types/user.types';

export class LoanService {
  static async getLoans(
    userRole: UserRole,
    statusQuery?: string,
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;

    // Enforce default status filters based on executive role rules
    let statusFilter: any = statusQuery;

    if (userRole === UserRole.SANCTION) {
      statusFilter = LoanStatus.PENDING;
    } else if (userRole === UserRole.DISBURSEMENT) {
      statusFilter = LoanStatus.APPROVED;
    } else if (userRole === UserRole.COLLECTION) {
      statusFilter = LoanStatus.DISBURSED;
    }

    const query: any = {};
    if (statusFilter) {
      query.status = statusFilter;
    }

    const total = await Loan.countDocuments(query);
    const loans = await Loan.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Populate borrower details from the users collection
    const enrichedLoans = await Promise.all(
      loans.map(async loan => {
        const borrower = await User.findById(loan.borrowerId, 'fullName email');
        const serializedLoan = loan.toJSON();
        return {
          ...serializedLoan,
          borrower: borrower
            ? {
                fullName: borrower.fullName,
                email: borrower.email,
              }
            : undefined,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      loans: enrichedLoans,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getLoanById(id: string) {
    const loan = await Loan.findById(id);
    if (!loan) {
      const error: any = new Error('Loan not found');
      error.statusCode = 404;
      throw error;
    }

    const borrower = await User.findById(loan.borrowerId, 'fullName email');
    const payments = await Payment.find({ loanId: id }).sort({ createdAt: -1 });

    const serializedLoan = loan.toJSON();

    return {
      loan: {
        ...serializedLoan,
        borrower: borrower
          ? {
              fullName: borrower.fullName,
              email: borrower.email,
            }
          : undefined,
      },
      payments,
    };
  }

  static async approveLoan(id: string, userId: string) {
    const loan = await Loan.findById(id);
    if (!loan) {
      const error: any = new Error('Loan not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify PENDING status transition
    if (loan.status !== LoanStatus.PENDING) {
      const error: any = new Error('Invalid status transition. Loan must be PENDING to approve.');
      error.statusCode = 400;
      throw error;
    }

    loan.status = LoanStatus.APPROVED;
    loan.sanctionedBy = userId as any;
    loan.sanctionedAt = new Date();

    await loan.save();
    return loan;
  }

  static async rejectLoan(id: string, userId: string, reason: string) {
    if (!reason || reason.trim() === '') {
      const error: any = new Error('Rejection reason is required.');
      error.statusCode = 400;
      throw error;
    }

    const loan = await Loan.findById(id);
    if (!loan) {
      const error: any = new Error('Loan not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify PENDING status transition
    if (loan.status !== LoanStatus.PENDING) {
      const error: any = new Error('Invalid status transition. Loan must be PENDING to reject.');
      error.statusCode = 400;
      throw error;
    }

    loan.status = LoanStatus.REJECTED;
    loan.sanctionedBy = userId as any;
    loan.sanctionedAt = new Date();
    loan.rejectionReason = reason;

    await loan.save();
    return loan;
  }

  static async disburseLoan(id: string, userId: string) {
    const loan = await Loan.findById(id);
    if (!loan) {
      const error: any = new Error('Loan not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify APPROVED status transition
    if (loan.status !== LoanStatus.APPROVED) {
      const error: any = new Error('Invalid status transition. Loan must be APPROVED to disburse.');
      error.statusCode = 400;
      throw error;
    }

    loan.status = LoanStatus.DISBURSED;
    loan.disbursedBy = userId as any;
    loan.disbursedAt = new Date();

    await loan.save();
    return loan;
  }
}
export default LoanService;
