import { IUser } from './user.types';

export enum LoanStatus {
  PENDING    = 'PENDING',
  APPROVED   = 'APPROVED',
  REJECTED   = 'REJECTED',
  DISBURSED  = 'DISBURSED',
  CLOSED     = 'CLOSED',
}

export enum ApplicationStatus {
  DRAFT      = 'DRAFT',
  BRE_FAILED = 'BRE_FAILED',
  APPLIED    = 'APPLIED',
}

export enum EmploymentMode {
  SALARIED      = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED    = 'UNEMPLOYED',
}

export interface IBREResult {
  passed: boolean;
  failedRules: BRERuleCode[];
  checkedAt: string;
}

export type BRERuleCode =
  | 'AGE_OUT_OF_RANGE'
  | 'SALARY_BELOW_MINIMUM'
  | 'INVALID_PAN_FORMAT'
  | 'UNEMPLOYED_APPLICANT';

export interface IPersonalDetails {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface ILoanConfig {
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export interface IApplication {
  id: string;
  userId: string;
  step: number;
  personalDetails?: IPersonalDetails;
  breResult?: IBREResult;
  salarySlipUrl?: string;
  loanConfig?: ILoanConfig;
  status: ApplicationStatus;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoan {
  id: string;
  applicationId: string;
  borrowerId: string;
  borrower?: IUser;
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;  // virtual — computed client-side or by service
  status: LoanStatus;
  sanctionedBy?: string;
  sanctionedAt?: string;
  rejectionReason?: string;
  disbursedBy?: string;
  disbursedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}
