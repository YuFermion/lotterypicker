import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BallProps {
  number: number;
  type: 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Ball: React.FC<BallProps> = ({ 
  number, 
  type, 
  size = 'md', 
  selected = false,
  onClick,
  className 
}) => {
  const baseClasses = "rounded-full flex items-center justify-center font-bold shadow-md transition-all duration-200 select-none";
  
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  };

  const typeClasses = type === 'red' 
    ? (selected ? "bg-lottery-red text-white ring-2 ring-red-300 ring-offset-2" : "bg-white text-lottery-red border border-gray-200 hover:bg-red-50")
    : (selected ? "bg-lottery-blue text-white ring-2 ring-blue-300 ring-offset-2" : "bg-white text-lottery-blue border border-gray-200 hover:bg-blue-50");

  // If simply displaying (no onClick), force filled style
  const displayClasses = !onClick 
    ? (type === 'red' ? "bg-gradient-to-br from-red-500 to-red-600 text-white" : "bg-gradient-to-br from-blue-500 to-blue-600 text-white")
    : typeClasses;

  return (
    <div 
      onClick={onClick}
      className={twMerge(
        baseClasses, 
        sizeClasses[size], 
        onClick ? typeClasses : displayClasses,
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
    >
      {number.toString().padStart(2, '0')}
    </div>
  );
};