// src/utils/formatters.js

/**
 * Format a number as Indian Rupee (INR)
 * @param {number} value - The number to format
 * @returns {string} - Formatted currency string (e.g. ₹1,50,000.00)
 */
export const formatCurrency = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Format string as phone number
 * @param {string} phone - phone digit sequence
 * @returns {string} formatted phone
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})?(\d{5})(\d{5})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : '';
    return `${intlCode}${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Format decimal as percentage
 * @param {number} value - decimal value
 * @returns {string} percentage layout
 */
export const formatPercent = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0%';
  return `${Math.round(num * 100)}%`;
};

/**
 * Shorten long descriptions
 * @param {string} text - source text
 * @param {number} limit - maximum length
 * @returns {string} shortened text
 */
export const truncateText = (text, limit = 100) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
};
