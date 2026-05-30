import { BRERuleCode, IBREResult } from '@lms/shared/src/types/loan.types';

interface BREInput {
  dateOfBirth: Date | string;
  monthlySalary: number;
  pan: string;
  employmentMode: string;
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function getAgeInYears(dob: Date | string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function runBRE(input: BREInput): IBREResult {
  const failedRules: BRERuleCode[] = [];

  const age = getAgeInYears(input.dateOfBirth);
  if (age < 23 || age > 50) {
    failedRules.push('AGE_OUT_OF_RANGE');
  }

  if (input.monthlySalary < 25000) {
    failedRules.push('SALARY_BELOW_MINIMUM');
  }

  if (!PAN_REGEX.test(input.pan)) {
    failedRules.push('INVALID_PAN_FORMAT');
  }

  if (input.employmentMode === 'UNEMPLOYED') {
    failedRules.push('UNEMPLOYED_APPLICANT');
  }

  return {
    passed: failedRules.length === 0,
    failedRules,
    checkedAt: new Date().toISOString(),
  };
}

// Human-readable messages for the frontend to display (use this map client-side):
export const BRE_RULE_MESSAGES: Record<BRERuleCode, string> = {
  AGE_OUT_OF_RANGE:      'Applicant age must be between 23 and 50 years.',
  SALARY_BELOW_MINIMUM:  'Monthly salary must be at least Rs. 25,000.',
  INVALID_PAN_FORMAT:    'PAN number format is invalid. Expected format: ABCDE1234F',
  UNEMPLOYED_APPLICANT:  'Unemployed applicants are not eligible for a loan.',
};
