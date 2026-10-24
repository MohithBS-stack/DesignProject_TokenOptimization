import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0E8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase text-xs';

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 gap-1.5 text-[11px]',
    md: 'px-4 py-2 gap-2 text-xs',
    lg: 'px-6 py-3 gap-2.5 text-sm tracking-wide',
  };

  const variantClasses = {
    primary:
      'bg-[#171717] hover:bg-[#2457C5] text-[#FFFFFF] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
    secondary:
      'bg-[#FFFFFF] hover:bg-[#E7E3D9] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
    outline:
      'bg-[#FFFFFF] hover:bg-[#F2C230] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
    ghost:
      'text-[#171717] hover:bg-[#E7E3D9] border-2 border-transparent hover:border-[#171717] active:translate-x-[1px] active:translate-y-[1px]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-0.5 mr-1.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

