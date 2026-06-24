// src/components/common/StarRating.jsx
import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, maxRating = 5, className = '' }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Array.from({ length: maxRating }).map((_, idx) => (
        <Star
          key={idx}
          className={`w-4 h-4 ${idx < rating ? 'text-gold fill-gold' : 'text-white/20'}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
