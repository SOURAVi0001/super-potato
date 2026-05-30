import Application from './application.model';
import Loan from '../loans/loan.model';
import { runBRE } from './bre.service';
import { calculateLoan } from '../../utils/loanCalculator';
import { ApplicationStatus, LoanStatus, EmploymentMode } from '@lms/shared/src/types/loan.types';

export class ApplicationService {
  static async savePersonalDetails(
    userId: string,
    details: {
      fullName: string;
      pan: string;
      dateOfBirth: string;
      monthlySalary: number;
      employmentMode: EmploymentMode;
    }
  ) {
    let app = await Application.findOne({ userId });

    if (!app) {
      app = new Application({ userId });
    }

    // Autoritative execution of Business Rules Engine
    const breResult = runBRE({
      dateOfBirth: new Date(details.dateOfBirth),
      monthlySalary: details.monthlySalary,
      pan: details.pan,
      employmentMode: details.employmentMode,
    });

    app.personalDetails = {
      fullName: details.fullName,
      pan: details.pan,
      dateOfBirth: new Date(details.dateOfBirth),
      monthlySalary: details.monthlySalary,
      employmentMode: details.employmentMode,
    };
    app.breResult = {
      passed: breResult.passed,
      failedRules: breResult.failedRules,
      checkedAt: new Date(breResult.checkedAt),
    };

    if (breResult.passed) {
      app.status = ApplicationStatus.DRAFT;
      app.step = 2; // Move to upload slip step
    } else {
      app.status = ApplicationStatus.BRE_FAILED;
      app.step = 1; // Blocked at personal details
    }

    await app.save();
    return { application: app, breResult };
  }

  static async saveSalarySlip(
    userId: string,
    file: { buffer: Buffer; mimetype: string; originalname: string }
  ) {
    const app = await Application.findOne({ userId });
    if (!app) {
      const error: any = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    if (!app.breResult || !app.breResult.passed) {
      const error: any = new Error('BRE check not passed yet');
      error.statusCode = 400;
      throw error;
    }

    // 1. Persist the binary file stream in MongoDB
    app.salarySlip = {
      data: file.buffer,
      contentType: file.mimetype,
      filename: file.originalname,
    };

    // 2. Set client url to point directly to the database-driven download route
    const fileUrl = `api/v1/applications/${app.id}/salary-slip`;
    app.salarySlipUrl = fileUrl;
    app.step = 3; // Move to configurations step

    await app.save();
    return { salarySlipUrl: fileUrl, application: app };
  }

  static async getSalarySlipById(id: string) {
    return await Application.findById(id);
  }

  static async saveLoanConfig(userId: string, amount: number, tenureDays: number) {
    const app = await Application.findOne({ userId });
    if (!app) {
      const error: any = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    if (!app.breResult || !app.breResult.passed) {
      const error: any = new Error('BRE check not passed yet');
      error.statusCode = 400;
      throw error;
    }

    if (amount < 50000 || amount > 500000) {
      const error: any = new Error('Loan amount must be between Rs. 50,000 and Rs. 5,00,000');
      error.statusCode = 400;
      throw error;
    }

    if (tenureDays < 30 || tenureDays > 365) {
      const error: any = new Error('Loan tenure must be between 30 and 365 days');
      error.statusCode = 400;
      throw error;
    }

    // Authoritative Server calculations
    const calc = calculateLoan(amount, tenureDays);

    app.loanConfig = {
      amount,
      tenureDays,
      interestRate: calc.ratePerAnnum,
      simpleInterest: calc.simpleInterest,
      totalRepayment: calc.totalRepayment,
    };
    app.step = 4; // Ready for submission

    await app.save();
    return { loanConfig: app.loanConfig, application: app };
  }

  static async submitApplication(userId: string) {
    const app = await Application.findOne({ userId });
    if (!app) {
      const error: any = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    const isComplete =
      app.step === 4 &&
      app.breResult &&
      app.breResult.passed &&
      app.salarySlipUrl &&
      app.loanConfig;

    if (!isComplete) {
      const error: any = new Error('Application is incomplete');
      error.statusCode = 400;
      throw error;
    }

    // Check if borrower already has an active loan (pending, approved, disbursed)
    const existingLoan = await Loan.findOne({
      borrowerId: userId,
      status: { $in: [LoanStatus.PENDING, LoanStatus.APPROVED, LoanStatus.DISBURSED] },
    });

    if (existingLoan) {
      const error: any = new Error('You already have an active loan application');
      error.statusCode = 400;
      throw error;
    }

    // Create standard loan record in PENDING state
    const loanConfig = app.loanConfig!;
    const loan = new Loan({
      applicationId: app._id,
      borrowerId: userId,
      amount: loanConfig.amount,
      tenureDays: loanConfig.tenureDays,
      interestRate: loanConfig.interestRate,
      simpleInterest: loanConfig.simpleInterest,
      totalRepayment: loanConfig.totalRepayment,
      status: LoanStatus.PENDING,
    });

    await loan.save();

    app.status = ApplicationStatus.APPLIED;
    app.appliedAt = new Date();
    await app.save();

    return { loan };
  }

  static async getMine(userId: string) {
    const application = await Application.findOne({ userId });
    const loan = await Loan.findOne({ borrowerId: userId }).sort({ createdAt: -1 });

    return {
      application,
      loan,
    };
  }
}
export default ApplicationService;
