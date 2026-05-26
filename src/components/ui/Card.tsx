import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  goldBorder?: boolean;
  key?: React.Key;
}

export const Card = ({ children, className, hoverEffect = false, goldBorder = false }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1 hover:shadow-xl',
        goldBorder && 'hover:border-gold-400',
        className
      )}
    >
      {children}
    </div>
  );
};
