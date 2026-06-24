// src/components/common/Badge.jsx
import React from 'react';

export const Badge = ({ children, status = 'info', className = '' }) => {
  const statusColors = {
    success: 'bg-success/15 text-success border border-success/30',
    danger: 'bg-danger/15 text-danger border border-danger/30',
    warning: 'bg-warning/15 text-warning border border-warning/30',
    info: 'bg-gold/15 text-gold border border-gold/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${statusColors[status] || statusColors.info} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
