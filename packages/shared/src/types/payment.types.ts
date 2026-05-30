export interface IPayment {
  id: string;
  loanId: string;
  borrowerId: string;
  recordedBy: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
