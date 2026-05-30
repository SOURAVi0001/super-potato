import { z } from 'zod';
import { EmploymentMode } from '@lms/shared/src/types/loan.types';

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const personalDetailsSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  pan: z.string().toUpperCase().regex(PAN_REGEX, 'Invalid PAN format. E.g. ABCDE1234F'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  monthlySalary: z.coerce.number().min(1, 'Monthly salary must be a positive number'),
  employmentMode: z.nativeEnum(EmploymentMode, {
    errorMap: () => ({ message: 'Please select an employment mode' }),
  }),
});

export const paymentSchema = z.object({
  utrNumber: z.string().min(1, 'UTR number is required').trim(),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than zero'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  notes: z.string().optional(),
});
