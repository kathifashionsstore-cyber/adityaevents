// src/hooks/useStorage.js
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadFileWithProgress = (file, path) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setUrl(null);

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          setError(err.message);
          setUploading(false);
          reject(err);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setUrl(downloadUrl);
            setUploading(false);
            resolve(downloadUrl);
          } catch (e) {
            setError(e.message);
            setUploading(false);
            reject(e);
          }
        }
      );
    });
  };

  return { uploadFileWithProgress, progress, url, error, uploading };
};

export default useStorage;
