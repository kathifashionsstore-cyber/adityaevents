// src/services/referralService.js
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Register a new referral code
 * @param {string} referrerName - client name
 * @param {string} referrerPhone - client contact
 * @returns {Object} referral
 */
export const createReferral = async (referrerName, referrerPhone) => {
  const prefix = referrerName.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const code = prefix + Math.floor(100 + Math.random() * 900);
  const data = {
    code,
    referrerName,
    referrerPhone,
    clicks: 0,
    conversions: 0,
    payoutEarned: 0,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'referrals', code), data);
  return data;
};

/**
 * Increment referral click count
 * @param {string} code - Referral code
 */
export const trackReferralClick = async (code) => {
  try {
    const ref = doc(db, 'referrals', code.toUpperCase());
    await updateDoc(ref, {
      clicks: increment(1)
    });
  } catch (error) {
    console.error("Error tracking referral click:", error);
  }
};

/**
 * Retrieve referral metrics
 * @returns {Array} list
 */
export const getReferralsList = async () => {
  const snap = await getDocs(collection(db, 'referrals'));
  const list = [];
  snap.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
