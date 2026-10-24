import React from 'react';

export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'idle';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const configs = {
    online: {
      bg: 'bg-[#FFFFFF] border-[#171717] text-[#171717]',
      dot: 'bg-[#2457C5]',
    },
    offline: {
      bg: 'bg-[#FDF2F2] border-[#E53935] text-[#E53935]',
      dot: 'bg-[#E53935]',
    },
    warning: {
      bg: 'bg-[#FFFDF0] border-[#171717] text-[#171717]',
      dot: 'bg-[#F2C230]',
    },
    idle: {
      bg: 'bg-[#E7E3D9] border-[#171717] text-[#4A4A4A]',
      dot: 'bg-[#717171]',
    },
  };

  const config = configs[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold tracking-wider uppercase border shadow-[1.5px_1.5px_0px_#171717] ${config.bg}`}
    >
      <span className={`w-2 h-2 shrink-0 ${config.dot}`} />
      {label}
    </span>
  );
};

