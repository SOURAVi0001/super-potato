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
        <h2 className="text-base font-bold text-slate-100 uppercase tracking-widest mb-1">
          Personal Details
        </h2>
        <p className="text-xs text-slate-400">Step 2: Collect profile inputs for credit checks</p>
      </div>

      {/* BRE failure alert panel */}
      {breResult && !breResult.passed && (
        <div className="p-5 bg-rose-950/40 border border-rose-900/40 rounded-xl shadow-[0_0_30px_rgba(244,63,94,0.05)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-rose-900/40 text-rose-400 rounded-lg shrink-0 border border-rose-800/60">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-widest mb-1.5">BRE Verification Rejected</h4>
              <p className="text-xs text-slate-400 leading-normal mb-3">
                Your profile fails to satisfy our active underwriting policy checks:
              </p>
              <ul className="space-y-1.5">
                {breResult.failedRules.map((rule) => (
                  <li key={rule} className="text-xs font-semibold text-rose-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    {BRE_RULE_MESSAGES[rule] || rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="p-4 bg-rose-950/40 border border-rose-900/40 rounded-lg text-xs font-semibold text-rose-400 tracking-wide">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Sourav Choudhary"
          error={errors.fullName?.message}
          {...register('fullName')}
          disabled={loading}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="PAN Number (10 chars)"
            type="text"
            placeholder="e.g. ABCDE1234F"
            error={errors.pan?.message}
            {...register('pan')}
            disabled={loading}
          />

          <Input
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Monthly Salary (INR)"
            type="number"
            placeholder="e.g. 55000"
            error={errors.monthlySalary?.message}
            {...register('monthlySalary')}
            disabled={loading}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Employment Mode
            </label>
            <select
              className={`w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 hover:border-slate-700 ${
                errors.employmentMode ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20' : ''
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
              <p className="mt-1.5 text-xs text-rose-400 font-semibold tracking-wide">
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
