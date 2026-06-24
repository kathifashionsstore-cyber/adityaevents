// src/utils/helpers.js

/**
 * Generate a unique booking confirmation ID
 * Format: AE-YYYYMMDD-XXXX
 * @returns {string} ID
 */
export const generateBookingId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `AE-${dateStr}-${randomDigits}`;
};

/**
 * Generate unique transaction reference ID
 * @returns {string} ID
 */
export const generatePaymentId = () => {
  return 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase();
};

/**
 * Generate unique invoice receipt number
 * @returns {string} ID
 */
export const generateReceiptNo = () => {
  const randomStr = Math.floor(100000 + Math.random() * 900000);
  return `AE-REC-${randomStr}`;
};

/**
 * Smoothly scroll to a section on the page
 * @param {string} sectionId - HTML ID
 */
export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Simple debounce helper
 * @param {Function} func - Callback
 * @param {number} wait - Time to wait in ms
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
