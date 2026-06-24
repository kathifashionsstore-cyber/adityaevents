// src/hooks/useRealtime.js
import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useRealtimeCollection = (collectionPath, orderField = 'createdAt') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = collection(db, collectionPath);
    if (orderField) {
      q = query(q, orderBy(orderField, 'desc'));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
      setLoading(false);
    }, (error) => {
      console.error(`Error in realtime subscription for collection ${collectionPath}:`, error);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionPath, orderField]);

  return { data, loading };
};

export const useRealtimeDocument = (collectionPath, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }
    const ref = doc(db, collectionPath, docId);
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() });
      } else {
        setData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error(`Error in realtime subscription for doc ${collectionPath}/${docId}:`, error);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionPath, docId]);

  return { data, loading };
};
