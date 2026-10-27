import React from 'react';

export const Badge = ({ count = 0, className = '' }) => {
  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-2xs font-semibold rounded-full bg-indigo-500 text-white min-w-4 text-center select-none shadow-sm ${className}`}
    >
      {displayCount}
    </span>
  );
};
