'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoan } from '../../../hooks/useLoan';
import useApplicationStore from '../../../store/applicationStore';
import { ApplicationStatus } from '@lms/shared/src/types/loan.types';
import Stepper from '../../../components/ui/Stepper';

// Import step forms
import PersonalDetails from './steps/PersonalDetails';
import SalaryUpload from './steps/SalaryUpload';
import LoanConfig from './steps/LoanConfig';

export default function ApplyPage() {
  const { getMyApplication } = useLoan();
  const router = useRouter();
  const {
    step,
    setStep,
    setPersonalDetails,
    setSalarySlip,
    setLoanConfig,
    resetWizard,
  } = useApplicationStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function syncApplicationState() {
      try {
        const data = await getMyApplication();
        
        if (data && data.application) {
          const app = data.application;
          
          // Redirect immediately if already applied
          if (app.status === ApplicationStatus.APPLIED) {
            router.replace('/my-loan');
            return;
          }

          // Hydrate Zustand state with actual backend records
          if (app.personalDetails && app.breResult) {
            setPersonalDetails(app.personalDetails, app.breResult, app.status);
          }
          if (app.salarySlipUrl) {
            setSalarySlip(app.salarySlipUrl);
          }
          if (app.loanConfig) {
            setLoanConfig(app.loanConfig);
          }
          if (app.step) {
            setStep(app.step);
          }
        } else {
          // Restart fresh if no application draft is recorded
          resetWizard();
        }
      } catch (err) {
        console.error('Failed to sync application state:', err);
      } finally {
        setHydrated(true);
      }
    }
    syncApplicationState();
  }, []);

  if (!hydrated) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Hydrating application wizard...</p>
        </div>
      </div>
    );
  }

  // Render correct component based on step configurations
  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <PersonalDetails />;
      case 2:
        return <SalaryUpload />;
      case 3:
        return <LoanConfig />;
      default:
        return <PersonalDetails />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Visual Stepper tracker (currentStep represents 1-4) */}
      <Stepper currentStep={step} />
      
      {/* Active Form */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-xl">
        {renderStepComponent()}
      </div>
    </div>
  );
}
