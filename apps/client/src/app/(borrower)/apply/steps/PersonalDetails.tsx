'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoan } from '../../../../hooks/useLoan';
import useApplicationStore from '../../../../store/applicationStore';
import { personalDetailsSchema } from '../../../../lib/validations';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { EmploymentMode, BRERuleCode } from '@lms/shared/src/types/loan.types';

type DetailsFormValues = {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
};

const BRE_RULE_MESSAGES: Record<BRERuleCode, string> = {
  AGE_OUT_OF_RANGE:      'Applicant age must be between 23 and 50 years.',
  SALARY_BELOW_MINIMUM:  'Monthly salary must be at least Rs. 25,000.',
  INVALID_PAN_FORMAT:    'PAN number format is invalid. Expected format: ABCDE1234F',
  UNEMPLOYED_APPLICANT:  'Unemployed applicants are not eligible for a loan.',
};

export default function PersonalDetails() {
  const { savePersonalDetails, loading, error: apiError } = useLoan();
  const { personalDetails, breResult, setPersonalDetails } = useApplicationStore();

  // Convert Date of Birth Date object back to ISO string for default input mapping
  const formattedDob = personalDetails?.dateOfBirth
    ? new Date(personalDetails.dateOfBirth).toISOString().split('T')[0]
    : '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      fullName: personalDetails?.fullName || '',
      pan: personalDetails?.pan || '',
      dateOfBirth: formattedDob,
      monthlySalary: personalDetails?.monthlySalary || 0,
      employmentMode: personalDetails?.employmentMode || undefined,
    },
  });

  const onSubmit = async (data: DetailsFormValues) => {
    try {
      const response = await savePersonalDetails({
        fullName: data.fullName,
        pan: data.pan.toUpperCase(),
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        monthlySalary: Number(data.monthlySalary),
        employmentMode: data.employmentMode,
      });

      const { application, breResult: bre } = response;
      setPersonalDetails(application.personalDetails, bre, application.status);
    } catch (err) {
      console.error('Failed to submit personal details:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-medium text-stone-900 mb-1">
          Personal details
        </h2>
        <p className="text-[12px] text-stone-400">Step 1: Collect profile inputs for credit checks</p>
      </div>

      {/* BRE failure alert panel — warm red palette, no neon */}
      {breResult && !breResult.passed && (
        <div className="bg-[#f5ebe8] border border-[#d4a898] rounded-lg p-5">
          <h3 className="text-[14px] font-medium text-[#5c1e12] mb-1.5">Application not eligible</h3>
          <p className="text-[13px] text-[#7a2e20] mb-3">
            Your profile does not satisfy our active underwriting policy checks:
          </p>
          <ul className="space-y-2">
            {breResult.failedRules.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-[13px] text-[#7a2e20]">
                <span className="mt-0.5 flex-shrink-0 text-[#c47a6a] font-bold">×</span>
                <span>{BRE_RULE_MESSAGES[rule] || rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {apiError && (
        <div className="p-3 rounded bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="e.g. Sourav Choudhary"
          error={errors.fullName?.message}
          {...register('fullName')}
          disabled={loading}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="PAN number (10 chars)"
            type="text"
            placeholder="e.g. ABCDE1234F"
            error={errors.pan?.message}
            {...register('pan')}
            disabled={loading}
          />

          <Input
            label="Date of birth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Monthly salary (INR)"
            type="number"
            placeholder="e.g. 55000"
            error={errors.monthlySalary?.message}
            {...register('monthlySalary')}
            disabled={loading}
          />

          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-stone-600 font-medium">
              Employment mode
            </label>
            <select
              className={`w-full bg-[#fdfcfa] border border-stone-300 text-stone-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 hover:border-stone-400 transition-all duration-150 ${
                errors.employmentMode ? 'border-[#d4a898] focus:border-[#7a2e20]' : ''
              }`}
              {...register('employmentMode')}
              disabled={loading}
            >
              <option value="">Select employment status...</option>
              <option value={EmploymentMode.SALARIED}>Salaried</option>
              <option value={EmploymentMode.SELF_EMPLOYED}>Self-Employed</option>
              <option value={EmploymentMode.UNEMPLOYED}>Unemployed</option>
            </select>
            {errors.employmentMode && (
              <p className="text-[12px] text-[#7a2e20] mt-0.5">
                {errors.employmentMode.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={loading}
        >
          Check Eligibility & Continue
        </Button>
      </form>
    </div>
  );
}
