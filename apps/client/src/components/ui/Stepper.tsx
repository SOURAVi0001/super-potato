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
    <div className="flex items-center gap-0 w-full mb-8 bg-white border border-stone-200 rounded-lg px-6 py-4 shadow-card">
      {STEPS.map((s, idx) => {
        const i = s.step;
        const isActive = currentStep === i;
        const isCompleted = currentStep > i;

        return (
          <React.Fragment key={i}>
            {/* Step dot */}
            <div className={`
              flex items-center gap-2
              ${isCompleted ? 'text-brand-600' : isActive ? 'text-stone-900' : 'text-stone-400'}
            `}>
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 transition-all duration-150
                ${isCompleted
                  ? 'bg-brand-600 text-[#fdf6ee]'
                  : isActive
                    ? 'border-2 border-stone-800 text-stone-800 bg-white'
                    : 'border border-stone-300 text-stone-400 bg-white'}
              `}>
                {isCompleted ? '✓' : i}
              </div>
              <span className="text-[12px] font-medium whitespace-nowrap">{s.label}</span>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-4 transition-all duration-300 ${isCompleted ? 'bg-brand-400' : 'bg-stone-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
export default Stepper;
