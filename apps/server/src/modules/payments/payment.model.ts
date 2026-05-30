import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
  {
    loanId: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: true,
    },
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    utrNumber: {
      type: String,
      required: true,
      unique: true, // DB level unique constraint
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Payment amount must be greater than zero'],
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ utrNumber: 1 }, { unique: true });
paymentSchema.index({ loanId: 1 });

// Enforce serialization logic: convert _id to id, hide Mongoose internal key
paymentSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Payment = model('Payment', paymentSchema);
export default Payment;
