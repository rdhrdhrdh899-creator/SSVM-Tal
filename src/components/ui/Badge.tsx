import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gold' | 'maroon';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge = ({ children, variant = 'primary', className, style }: BadgeProps) => {
  const variants = {
    primary: 'bg-navy-50 text-navy-800 border-navy-100',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    gold: 'bg-gold-50 text-gold-700 border-gold-200',
    maroon: 'bg-maroon-50 text-maroon-700 border-maroon-100',
  };

  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
