// src/hooks/useBookings.js
import { useState, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { createBooking as createBookingAPI } from '../services/bookingService';

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkSlotAvailability = useCallback(async (dateString) => {
    if (!dateString) return false;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('eventDate', '==', dateString),
        where('status', '==', 'confirmed')
      );
      const snapshot = await getDocs(q);
      setLoading(false);
      return snapshot.empty; // true if empty (slot is free)
    } catch (e) {
      setError(e.message);
      setLoading(false);
      return false;
    }
  }, []);

  const saveBooking = async (bookingData, pricing) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createBookingAPI(bookingData, pricing);
      setLoading(false);
      return res;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  return { checkSlotAvailability, saveBooking, loading, error };
};

export default useBookings;
