import { Schema, model } from 'mongoose';
import { ApplicationStatus, EmploymentMode } from '@lms/shared/src/types/loan.types';

const applicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One application per borrower
    },
    step: {
      type: Number,
      default: 1, // Tracks progress from step 1 to 4
    },
    personalDetails: {
      fullName: String,
      pan: String,
      dateOfBirth: Date,
      monthlySalary: Number,
      employmentMode: {
        type: String,
        enum: Object.values(EmploymentMode),
      },
    },
    breResult: {
      passed: Boolean,
      failedRules: [String],
      checkedAt: Date,
    },
    salarySlipUrl: {
      type: String,
    },
    loanConfig: {
      amount: Number,
      tenureDays: Number,
      interestRate: {
        type: Number,
        default: 12,
      },
      simpleInterest: Number,
      totalRepayment: Number,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.DRAFT,
    },
    appliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce serialization logic: convert _id to id, hide Mongoose internal key
applicationSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Application = model('Application', applicationSchema);
export default Application;
