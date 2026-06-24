// src/services/couponService.js
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Validate and query coupon details
 * @param {string} code - coupon code string
 * @returns {Object} response status and data
 */
export const validateCoupon = async (code) => {
  if (!code) return { success: false, message: 'Please enter a coupon code' };
  try {
    const ref = doc(db, 'coupons', code.toUpperCase());
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { success: false, message: 'Invalid coupon code' };
    }
    const data = snap.data();
    const expiry = new Date(data.expiryDate);
    if (new Date() > expiry) {
      return { success: false, message: 'This coupon has expired' };
    }
    if (!data.active) {
      return { success: false, message: 'This coupon is inactive' };
    }
    return { success: true, coupon: data };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { success: false, message: 'Error validating coupon' };
  }
};

/**
 * Create or save a coupon code in database
 * @param {Object} couponData - coupon details
 */
export const createCoupon = async (couponData) => {
  const code = couponData.code.toUpperCase();
  const data = {
    code,
    type: couponData.type, // 'percentage' | 'fixed'
    value: parseFloat(couponData.value),
    expiryDate: couponData.expiryDate,
    active: !!couponData.active,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'coupons', code), data);
  return data;
};

/**
 * Retrieve all coupons
 * @returns {Array} coupons list
 */
export const getCoupons = async () => {
  const snapshot = await getDocs(collection(db, 'coupons'));
  const list = [];
  snapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Delete a coupon code
 * @param {string} code - Coupon identifier
 */
export const deleteCoupon = async (code) => {
  await deleteDoc(doc(db, 'coupons', code.toUpperCase()));
};
