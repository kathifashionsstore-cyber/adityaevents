// src/services/notificationService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Dispatch a system-wide or user-specific notification alert doc
 * @param {string} userId - target user ID or 'admin' for global admin dashboard alerts
 * @param {string} title - title
 * @param {string} message - description
 */
export const sendSystemNotification = async (userId, title, message) => {
  try {
    const newNotification = {
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'notifications'), newNotification);
  } catch (error) {
    console.error("Error creating system notification document:", error);
  }
};
