// src/components/common/Button.jsx
import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'gold', className = '', disabled = false }) => {
  const baseClass = 'btn-premium';
  const variantClass = variant === 'gold' ? 'btn-gold' : 'btn-outline-gold';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
