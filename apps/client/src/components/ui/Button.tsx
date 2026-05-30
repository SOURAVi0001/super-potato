import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-600/15 disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-800 active:scale-[0.99] text-[#fdf6ee] text-[13px] px-4 py-2 shadow-sm',
    secondary: 'border border-stone-200 hover:border-stone-300 bg-transparent hover:bg-stone-50 text-stone-700 text-[13px] px-4 py-2',
    accent: 'bg-brand-600 hover:bg-brand-800 active:scale-[0.99] text-[#fdf6ee] text-[13px] px-4 py-2 shadow-sm',
    outline: 'border border-stone-200 hover:border-stone-300 bg-transparent hover:bg-stone-50 text-stone-700 text-[13px] px-4 py-2',
    ghost: 'text-stone-500 hover:text-stone-700 hover:bg-stone-100/50 text-[13px] px-3 py-2',
    danger: 'border border-[#d4a898] hover:bg-[#f5ebe8] bg-transparent text-[#7a2e20] text-[13px] px-4 py-2',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
export default Button;
