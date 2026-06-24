// src/components/common/Input.jsx
import React from 'react';

export const Input = ({ label, type = 'text', name, value, onChange, placeholder = '', required = false, className = '', error = '' }) => {
  return (
    <div className={`flex flex-col space-y-1 w-full ${className}`}>
      {label && (
        <label className="font-body text-xs font-semibold text-champagne/80 tracking-wider">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-premium"
      />
      {error && <span className="font-body text-[10px] text-danger mt-1">{error}</span>}
    </div>
  );
};

export default Input;
