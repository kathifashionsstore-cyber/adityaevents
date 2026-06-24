// src/components/common/Card.jsx
import React from 'react';

export const Card = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div
      className={`card-premium ${hoverEffect ? 'hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
