import React from 'react';

export const UserAvatar = ({
  name = 'User',
  status = 'offline',
  size = 'md',
  bgClass = 'bg-indigo-600',
  showStatus = true,
  className = '',
}) => {
  // Derive 1 or 2 letter initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U';

  const sizeClasses = {
    xs: 'w-6 h-6 text-2xs',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg font-bold',
  }[size] || 'w-9 h-9 text-sm';

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  }[size] || 'w-2.5 h-2.5 ring-2';

  const statusColors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-400',
    busy: 'bg-rose-500',
    offline: 'bg-slate-500',
  }[status] || 'bg-slate-500';

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses} ${bgClass} text-white font-medium rounded-xl flex items-center justify-center shadow-sm select-none`}
        aria-label={name}
      >
        {initials}
      </div>

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusDotSizes} ${statusColors} ring-slate-900 rounded-full`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
