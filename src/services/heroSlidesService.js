// src/services/heroSlidesService.js
import { collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'heroSlides';

/**
 * Subscribe to real-time updates for hero slides sorted by order.
 */
export const subscribeHeroSlides = (onData, onError) => {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = list.sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));
      onData(sorted);
    },
    onError
  );
};

/**
 * Add a new slide to database.
 */
export const createHeroSlide = async (slideData) => {
  const payload = {
    imageUrl: slideData.imageUrl || '',
    title: slideData.title || '',
    subtitle: slideData.subtitle || '',
    description: slideData.description || '',
    btnText: slideData.btnText || '',
    btnLink: slideData.btnLink || '',
    isActive: slideData.isActive !== false,
    displayOrder: Number(slideData.displayOrder) || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return { id: docRef.id, ...payload };
};

/**
 * Update an existing slide configuration.
 */
export const updateHeroSlide = async (id, slideData) => {
  const ref = doc(db, COLLECTION_NAME, id);
  await setDoc(ref, {
    ...slideData,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

/**
 * Delete a slide from database.
 */
export const deleteHeroSlide = async (id) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};

/**
 * Commit a batch reordering.
 */
export const reorderHeroSlides = async (slides) => {
  const batch = writeBatch(db);
  slides.forEach((slide, idx) => {
    batch.update(doc(db, COLLECTION_NAME, slide.id), {
      displayOrder: idx + 1,
      updatedAt: new Date().toISOString()
    });
  });
  await batch.commit();
};
