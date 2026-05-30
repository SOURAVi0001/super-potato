import React from 'react';

interface StepperProps {
  currentStep: number;
}

const STEPS = [
  { step: 1, label: 'Personal Details' },
  { step: 2, label: 'Salary Slip' },
  { step: 3, label: 'Loan Configuration' },
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full flex items-center justify-between py-6 px-4 md:px-8 bg-slate-900/30 rounded-xl border border-slate-800 backdrop-blur-md mb-8">
      {STEPS.map((s, idx) => {
        const isActive = currentStep === s.step;
        const isCompleted = currentStep > s.step;
        
        return (
          <React.Fragment key={s.step}>
            {/* Step Marker */}
            <div className="flex flex-col items-center flex-1 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-indigo-600 border-indigo-650 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]'
                    : isActive
                    ? 'bg-slate-950 border-indigo-500 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.step
                )}
              </div>
              <span
                className={`mt-2.5 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-center hidden sm:block ${
                  isActive ? 'text-indigo-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Stepper Connector Bar */}
            {idx < STEPS.length - 1 && (
              <div className="flex-grow h-[2px] mx-[-12px] md:mx-[-24px] bg-slate-800/80 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
export default Stepper;
