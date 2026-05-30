import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'primary', children }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium border transition-colors duration-150';
  
  const variants = {
    primary: 'bg-brand-50 text-brand-600 border-brand-200',
    secondary: 'bg-stone-100 text-stone-600 border-stone-200',
    success: 'bg-[#edf3ec] text-[#2d5c2a] border-[#a8c8a4]',
    warning: 'bg-[#f5f0e8] text-[#7a5c2e] border-[#d4b896]',
    danger: 'bg-[#f5ebe8] text-[#7a2e20] border-[#d4a898]',
    info: 'bg-[#eaeff5] text-[#1e3d5c] border-[#98b4cc]',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </span>
  );
}
export default Badge;
