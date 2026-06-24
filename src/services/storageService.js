// src/services/storageService.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Upload a raw file to Firebase Storage
 * @param {File} file - raw File object
 * @param {string} path - path destination (e.g. gallery/wedding.jpg)
 * @returns {string} download URL
 */
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
