// src/utils/dateHelpers.js
import { format, differenceInDays, parseISO, isToday as isDateToday } from 'date-fns';

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') return parseISO(value);
  if (typeof value === 'number') return new Date(value);
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  return null;
};

/**
 * Format ISO or standard string date into readable format
 * @param {string} dateString - input date
 * @returns {string} - formatted string (e.g. 04-Jun-2026)
 */
export const formatDateString = (dateString) => {
  if (!dateString) return '';
  try {
    const parsed = toDate(dateString);
    if (!parsed || Number.isNaN(parsed.getTime())) return '';
    return format(parsed, 'dd-MMM-yyyy');
  } catch (e) {
    return typeof dateString === 'string' ? dateString : '';
  }
};

/**
 * Get difference in days between today and target date
 * @param {string} dateString - target date
 * @returns {number} days difference
 */
export const getDaysUntil = (dateString) => {
  if (!dateString) return 0;
  try {
    const target = toDate(dateString);
    if (!target || Number.isNaN(target.getTime())) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(target, today);
  } catch (e) {
    return 0;
  }
};

/**
 * Check if the provided date string is today
 * @param {string} dateString - YYYY-MM-DD
 * @returns {boolean}
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  try {
    const parsed = toDate(dateString);
    return parsed ? isDateToday(parsed) : false;
  } catch (e) {
    return false;
  }
};

/**
 * Format date to full verbal month name
 * @param {string} dateString - YYYY-MM-DD
 * @returns {string} Month
 */
export const getEventMonthName = (dateString) => {
  if (!dateString) return '';
  try {
    const parsed = toDate(dateString);
    if (!parsed || Number.isNaN(parsed.getTime())) return '';
    return format(parsed, 'MMMM yyyy');
  } catch (e) {
    return '';
  }
};
