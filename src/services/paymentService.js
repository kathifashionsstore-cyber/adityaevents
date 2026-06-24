// src/services/paymentService.js
import { doc, setDoc, updateDoc, getDoc, collection, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';
import { generatePaymentId, generateReceiptNo } from '../utils/helpers';

/**
 * Initiates order creation (simulates backend communication or triggers Firebase Cloud Function)
 * @param {string} bookingId - booking reference
 * @param {number} amount - amount to collect (INR)
 * @returns {Object} order info
 */
export const initiateRazorpayOrder = async (bookingId, amount) => {
  // Simulating order generation. In a live system, this calls a cloud function endpoint
  const orderId = 'order_' + Math.random().toString(36).substring(2, 15);
  return {
    orderId,
    amount: amount * 100, // Razorpay works in paise
    currency: 'INR'
  };
};

/**
 * Record a payment event in Firestore upon successful client checkout
 * @param {Object} paymentData - details returned from checkout
 * @returns {Object} paymentDoc
 */
export const recordPaymentSuccess = async (paymentData) => {
  const transactionId = paymentData.razorpay_payment_id || generatePaymentId();
  const receiptNo = generateReceiptNo();
  const timestamp = new Date().toISOString();

  const paymentRecord = {
    transactionId,
    receiptNo,
    bookingId: paymentData.bookingId,
    amount: parseFloat(paymentData.amount),
    method: paymentData.method || 'netbanking',
    status: 'success',
    timestamp
  };

  // 1. Save payment record
  await setDoc(doc(db, 'payments', transactionId), paymentRecord);

  // 2. Load and update corresponding Booking balance
  const bookingRef = doc(db, 'bookings', paymentData.bookingId);
  const bookingSnap = await getDoc(bookingRef);
  
  if (bookingSnap.exists()) {
    const booking = bookingSnap.data();
    const paidAmount = parseFloat(booking.paidAmount || 0) + parseFloat(paymentData.amount);
    const totalAmount = parseFloat(booking.totalAmount);
    
    let paymentStatus = 'partially_paid';
    if (paidAmount >= totalAmount) {
      paymentStatus = 'fully_paid';
    }

    await updateDoc(bookingRef, {
      paidAmount,
      paymentStatus,
      status: 'confirmed', // Confirm booking automatically on first payment
      logs: arrayUnion({
        message: `Received payment ₹${paymentData.amount}. Transaction Ref: ${transactionId}.`,
        timestamp,
        user: 'Razorpay system'
      })
    });
  }

  // 3. Log activity
  await setDoc(doc(collection(db, 'activityLogs')), {
    action: 'PAYMENT_RECEIVE',
    target: transactionId,
    details: `Payment of ₹${paymentData.amount} received for booking ${paymentData.bookingId}`,
    timestamp
  });

  return paymentRecord;
};
