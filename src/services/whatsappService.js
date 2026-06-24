// src/services/whatsappService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getWhatsAppUrl } from '../utils/whatsappHelper';

/**
 * Handle WhatsApp messaging notifications
 * @param {string} phone - Target phone
 * @param {string} messageText - Message contents
 * @returns {string} whatsapp link
 */
export const sendWhatsAppNotification = async (phone, messageText) => {
  console.log(`[WhatsApp Service] Triggering message to ${phone}: ${messageText}`);
  try {
    const waLog = {
      phone,
      messageText,
      sentAt: new Date().toISOString(),
      status: 'sent_simulated'
    };
    await addDoc(collection(db, 'whatsappLogs'), waLog);
  } catch (error) {
    console.error("Error creating WhatsApp log document:", error);
  }

  // Return the direct click redirect link for manual follow up from admin dashboard
  return getWhatsAppUrl(phone, messageText);
};
