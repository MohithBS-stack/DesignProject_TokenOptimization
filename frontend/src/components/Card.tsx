import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  badge,
  className = '',
  hoverEffect = false,
}) => {
  return (
    <div
      className={`border-2 border-[#171717] bg-[#FFFFFF] p-5 shadow-[3px_3px_0px_#171717] ${
        hoverEffect ? 'transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#171717]' : ''
      } ${className}`}
    >
      {(title || badge) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#171717]">
          <div>
            {title && <h3 className="text-base font-bold tracking-tight text-[#171717] uppercase">{title}</h3>}
            {subtitle && <p className="text-xs text-[#717171] mt-0.5 font-mono">{subtitle}</p>}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

