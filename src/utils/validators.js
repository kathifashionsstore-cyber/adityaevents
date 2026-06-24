// src/utils/validators.js

/**
 * Validate email address format
 * @param {string} email - Email input
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * Validate Indian Phone number (10 digits)
 * @param {string} phone - Phone input
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  // Indian phone numbers can be 10 digits, or with 91 prefix
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};

/**
 * Validate that booking date is in the future
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {boolean}
 */
export const validateFutureDate = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(dateString);
  bookingDate.setHours(0, 0, 0, 0);
  return bookingDate >= today;
};

/**
 * Check if a value is not empty or undefined
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};
