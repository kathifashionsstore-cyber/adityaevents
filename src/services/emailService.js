// src/services/emailService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Simulate emailing transaction confirmation messages
 * @param {string} toEmail - Customer email address
 * @param {string} subject - Email subject
 * @param {string} templateName - Template name
 * @param {Object} variables - Form variable maps
 */
export const sendEmailNotification = async (toEmail, subject, templateName, variables) => {
  console.log(`[Email Service] Sending email to ${toEmail} with subject: ${subject}`);
  try {
    const emailLog = {
      to: toEmail,
      subject,
      templateName,
      variables,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    await addDoc(collection(db, 'emailLogs'), emailLog);
  } catch (error) {
    console.error("Error creating email log document:", error);
  }
};
