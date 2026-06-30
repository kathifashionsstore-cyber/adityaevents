// src/services/bookingService.js
import { doc, setDoc, getDoc, updateDoc, collection, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';
import { generateBookingId } from '../utils/helpers';

export const createBooking = async (bookingData) => {
  const bookingId = generateBookingId();
  const newBooking = {
    id: bookingId,
    customerName: bookingData.customerName,
    customerPhone: bookingData.customerPhone,
    customerEmail: bookingData.customerEmail || '',
    eventType: bookingData.eventType,
    eventDate: bookingData.eventDate,
    eventTime: bookingData.eventTime || '18:00',
    venueName: bookingData.venueName,
    venueAddress: bookingData.venueAddress,
    city: bookingData.city || 'Vijayawada',
    packageName: bookingData.packageName || 'Custom Decor',
    stageDecoration: bookingData.stageDecoration || 'standard',
    addons: {
      photography: !!bookingData.photography,
      videography: !!bookingData.videography,
      droneFootage: !!bookingData.droneFootage,
      soundSystemDJ: !!bookingData.soundSystemDJ,
    },
    catering: {
      enabled: !!bookingData.cateringEnabled,
      vegGuests: parseInt(bookingData.vegGuests) || 0,
      nonVegGuests: parseInt(bookingData.nonVegGuests) || 0,
    },
    status: 'pending', // pending, confirmed, completed, cancelled
    notes: bookingData.notes || '',
    logs: [
      {
        message: 'Booking request created.',
        timestamp: new Date().toISOString(),
        user: bookingData.customerName
      }
    ],
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'bookings', bookingId), newBooking);
  
  // Log activity
  await setDoc(doc(collection(db, 'activityLogs')), {
    action: 'BOOKING_CREATE',
    target: bookingId,
    details: `Booking created for ${bookingData.customerName} on ${bookingData.eventDate}`,
    timestamp: new Date().toISOString()
  });

  return newBooking;
};

export const getBooking = async (bookingId) => {
  const ref = doc(db, 'bookings', bookingId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Booking not found');
  }
  return snap.data();
};

export const updateBookingStatus = async (bookingId, status, user = 'System') => {
  const ref = doc(db, 'bookings', bookingId);
  const message = `Booking status updated to ${status}.`;
  
  await updateDoc(ref, {
    status,
    logs: arrayUnion({
      message,
      timestamp: new Date().toISOString(),
      user
    })
  });

  await setDoc(doc(collection(db, 'activityLogs')), {
    action: 'BOOKING_STATUS_UPDATE',
    target: bookingId,
    details: `Booking ${bookingId} status changed to ${status}`,
    timestamp: new Date().toISOString()
  });
};

export const addBookingLog = async (bookingId, message, user = 'Staff') => {
  const ref = doc(db, 'bookings', bookingId);
  await updateDoc(ref, {
    logs: arrayUnion({
      message,
      timestamp: new Date().toISOString(),
      user
    })
  });
};
