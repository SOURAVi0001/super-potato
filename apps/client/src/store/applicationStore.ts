import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IPersonalDetails, IBREResult, ILoanConfig, ApplicationStatus } from '@lms/shared/src/types/loan.types';

interface ApplicationState {
  step: number;
  personalDetails: IPersonalDetails | null;
  breResult: IBREResult | null;
  salarySlipUrl: string | null;
  loanConfig: ILoanConfig | null;
  applicationStatus: ApplicationStatus;
  
  setPersonalDetails: (details: IPersonalDetails, bre: IBREResult, status: ApplicationStatus) => void;
  setSalarySlip: (url: string) => void;
  setLoanConfig: (config: ILoanConfig) => void;
  setStep: (step: number) => void;
  resetWizard: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    set => ({
      step: 1,
      personalDetails: null,
      breResult: null,
      salarySlipUrl: null,
      loanConfig: null,
      applicationStatus: ApplicationStatus.DRAFT,

      setPersonalDetails: (details, bre, status) =>
        set({
          personalDetails: details,
          breResult: bre,
          applicationStatus: status,
          step: bre.passed ? 2 : 1,
        }),

      setSalarySlip: (url) =>
        set({
          salarySlipUrl: url,
          step: 3,
        }),

      setLoanConfig: (config) =>
        set({
          loanConfig: config,
          step: 4,
        }),

      setStep: (step) => set({ step }),

      resetWizard: () =>
        set({
          step: 1,
          personalDetails: null,
          breResult: null,
          salarySlipUrl: null,
          loanConfig: null,
          applicationStatus: ApplicationStatus.DRAFT,
        }),
    }),
    {
      name: 'lms-application-wizard-store', // Cache key in localStorage
    }
  )
);
export default useApplicationStore;
