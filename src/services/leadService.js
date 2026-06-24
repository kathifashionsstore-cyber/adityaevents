// src/services/leadService.js
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Log website contact inquiries as leads
 * @param {Object} leadData - customer lead details
 */
export const createLead = async (leadData) => {
  const newLead = {
    name: leadData.name,
    phone: leadData.phone,
    email: leadData.email || '',
    eventDate: leadData.eventDate || '',
    message: leadData.message || '',
    status: 'new', // new, contacting, qualified, lost
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, 'leads'), newLead);
  return { id: docRef.id, ...newLead };
};

/**
 * Fetch all logged leads (for admins)
 * @returns {Array} leads list
 */
export const getLeads = async () => {
  const snapshot = await getDocs(collection(db, 'leads'));
  const list = [];
  snapshot.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
};

/**
 * Update CRM status of a lead
 * @param {string} leadId - lead record ID
 * @param {string} status - new status flag
 */
export const updateLeadStatus = async (leadId, status) => {
  const ref = doc(db, 'leads', leadId);
  await updateDoc(ref, { status });
};
