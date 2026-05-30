import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label className="text-[13px] text-stone-600 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full border border-stone-300 rounded bg-[#fdfcfa] text-stone-800 text-[14px] px-3 py-2 placeholder:text-stone-400 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all duration-150 ${className} ${
            error ? 'border-[#d4a898] focus:border-[#7a2e20] focus:ring-2 focus:ring-[#7a2e20]/10' : ''
          }`}
          {...props}
        />
        {error && (
          <p className="text-[12px] text-[#7a2e20] mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
