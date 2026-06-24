// src/hooks/useFirestore.js
import { useState, useCallback } from 'react';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      setLoading(false);
      return docRef.id;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, [collectionName]);

  const updateDocument = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, collectionName, id), data);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, [collectionName]);

  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, id));
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, [collectionName]);

  return { addDocument, updateDocument, deleteDocument, loading, error };
};

export default useFirestore;
