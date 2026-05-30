import { Schema, model } from 'mongoose';
import { LoanStatus } from '@lms/shared/src/types/loan.types';

const loanSchema = new Schema(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tenureDays: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      default: 12,
      required: true,
    },
    simpleInterest: {
      type: Number,
      required: true,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.PENDING,
      required: true,
    },
    sanctionedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sanctionedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    disbursedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    disbursedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
loanSchema.index({ borrowerId: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ borrowerId: 1, status: 1 }); // Compound index for fast filtering

// Enforce serialization logic: convert _id to id, expose virtual outstandingBalance, hide Mongoose internal key
loanSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    ret.outstandingBalance = Math.round((ret.totalRepayment - ret.totalPaid) * 100) / 100;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Loan = model('Loan', loanSchema);
export default Loan;
