import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 hover:border-slate-700 ${className} ${
            error ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20' : ''
          }`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-rose-400 font-semibold tracking-wide">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
