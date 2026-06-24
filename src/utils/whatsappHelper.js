// src/utils/whatsappHelper.js

/**
 * Format a WhatsApp message and return click-to-chat URL
 * @param {string} phone - Business phone number (e.g. +91 93932 17676)
 * @param {string} text - Message text
 * @returns {string} - WhatsApp URL
 */
export const getWhatsAppUrl = (phone = '919393217676', text = '') => {
  const cleanedPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
};

export const formatBookingMessage = (bookingId, customerName, eventDate, totalAmount) => {
  return `Hello Adithya Event Management,\n\nI would like to inquire about my booking.\n\n*Booking Details:*\n- *ID:* ${bookingId}\n- *Name:* ${customerName}\n- *Date:* ${eventDate}\n- *Estimated Cost:* ${totalAmount}\n\nPlease confirm if this slot is available.\n\nThank you!`;
};
