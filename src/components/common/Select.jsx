// src/components/common/Select.jsx
import React from 'react';

export const Select = ({ label, name, value, onChange, options = [], required = false, className = '', error = '' }) => {
  return (
    <div className={`flex flex-col space-y-1 w-full ${className}`}>
      {label && (
        <label className="font-body text-xs font-semibold text-champagne/80 tracking-wider">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input-premium"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-charcoal text-champagne">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="font-body text-[10px] text-danger mt-1">{error}</span>}
    </div>
  );
};

export default Select;
