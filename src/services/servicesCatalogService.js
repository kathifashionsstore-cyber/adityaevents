// src/services/servicesCatalogService.js
import { collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'servicesCatalog';

/**
 * Subscribe to real-time updates for services catalog sorted by displayOrder.
 */
export const subscribeServicesCatalog = (onData, onError) => {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
      onData(sorted);
    },
    onError
  );
};

/**
 * Create a new service item.
 */
export const createServiceItem = async (data) => {
  const payload = {
    name: data.name || '',
    category: data.category || 'Stage Decor',
    description: data.description || '',
    inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
    imageUrl: data.imageUrl || '',
    isActive: data.isActive !== false,
    isFeatured: !!data.isFeatured,
    displayOrder: Number(data.displayOrder) || 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return { id: docRef.id, ...payload };
};

/**
 * Update an existing service item.
 */
export const updateServiceItem = async (id, data) => {
  const ref = doc(db, COLLECTION_NAME, id);
  await setDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

/**
 * Delete a service item.
 */
export const deleteServiceItem = async (id) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};

/**
 * Reorder service items.
 */
export const reorderServiceItems = async (items) => {
  const batch = writeBatch(db);
  items.forEach((item, idx) => {
    batch.update(doc(db, COLLECTION_NAME, item.id), {
      displayOrder: idx + 1,
      updatedAt: new Date().toISOString()
    });
  });
  await batch.commit();
};
