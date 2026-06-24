// src/services/smsService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Simulate SMS message alerts
 * @param {string} phone - phone number
 * @param {string} text - message text
 */
export const sendSMSNotification = async (phone, text) => {
  console.log(`[SMS Service] Sending SMS to ${phone}: ${text}`);
  try {
    const smsLog = {
      phone,
      text,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    await addDoc(collection(db, 'smsLogs'), smsLog);
  } catch (error) {
    console.error("Error creating SMS log document:", error);
  }
};
