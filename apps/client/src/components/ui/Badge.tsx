import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'primary', children }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase border';
  
  const variants = {
    primary: 'bg-indigo-950/40 text-indigo-400 border-indigo-800/60 glow-pulse-blue',
    secondary: 'bg-slate-900/60 text-slate-400 border-slate-800',
    success: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 glow-pulse-green',
    warning: 'bg-amber-950/40 text-amber-400 border-amber-800/60',
    danger: 'bg-rose-950/40 text-rose-400 border-rose-800/60 glow-pulse-red',
    info: 'bg-cyan-950/40 text-cyan-400 border-cyan-800/60 glow-pulse-teal',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </span>
  );
}
export default Badge;
