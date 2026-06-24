// src/services/analyticsService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Log page view analytics
 * @param {string} pageName - name of the page visited
 */
export const logPageView = async (pageName) => {
  if (typeof window === 'undefined') return;
  try {
    const log = {
      type: 'pageview',
      page: pageName,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, 'analytics'), log);
  } catch (error) {
    console.error("Error logging pageview analytics:", error);
  }
};

/**
 * Log event analytics
 * @param {string} category - Category
 * @param {string} action - Action
 * @param {string} label - Optional label details
 */
export const logEvent = async (category, action, label = '') => {
  try {
    const log = {
      type: 'event',
      category,
      action,
      label,
      timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, 'analytics'), log);
  } catch (error) {
    console.error("Error logging event analytics:", error);
  }
};
