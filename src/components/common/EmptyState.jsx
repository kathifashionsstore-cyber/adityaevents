// src/components/common/EmptyState.jsx
import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ message = 'No data available', subtext = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Inbox className="w-12 h-12 text-gold/30 mb-3" />
      <p className="font-body text-sm font-semibold text-champagne/80">{message}</p>
      {subtext && <p className="font-body text-xs text-champagne/50 mt-1">{subtext}</p>}
    </div>
  );
};

export default EmptyState;
