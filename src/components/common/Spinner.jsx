// src/components/common/Spinner.jsx
import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-gold border-r-white/10 border-b-white/10 border-l-white/10 ${sizes[size] || sizes.md}`} />
    </div>
  );
};

export default Spinner;
