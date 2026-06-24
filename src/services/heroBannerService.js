import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { HERO_BANNER_COLLECTION } from '../utils/heroBannerPages';

const sortHeroBanners = (items) =>
  [...items].sort((a, b) => {
    const aOrder = Number.isFinite(Number(a.displayOrder)) ? Number(a.displayOrder) : 999999;
    const bOrder = Number.isFinite(Number(b.displayOrder)) ? Number(b.displayOrder) : 999999;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return String(a.createdAt || a.title || '').localeCompare(String(b.createdAt || b.title || ''));
  });

export const subscribeHeroBanners = (pageKey, options = {}, onData, onError) => {
  const { activeOnly = false } = options;
  const bannersQuery = query(
    collection(db, HERO_BANNER_COLLECTION),
    where('page', '==', pageKey)
  );

  return onSnapshot(
    bannersQuery,
    (snapshot) => {
      const banners = snapshot.docs.map((bannerDoc) => ({
        id: bannerDoc.id,
        ...bannerDoc.data(),
      }));

      const filtered = activeOnly
        ? banners.filter((banner) => banner.isActive !== false)
        : banners;

      onData(sortHeroBanners(filtered));
    },
    onError
  );
};

export const createHeroBanner = async (data) => {
  const payload = {
    ...data,
    isActive: data.isActive !== false,
    displayOrder: Number(data.displayOrder) || 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  return addDoc(collection(db, HERO_BANNER_COLLECTION), payload);
};

export const updateHeroBanner = async (id, data) => {
  const bannerRef = doc(db, HERO_BANNER_COLLECTION, id);
  await updateDoc(bannerRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteHeroBanner = async (banner) => {
  if (banner.storagePath) {
    try {
      await deleteObject(ref(storage, banner.storagePath));
    } catch (error) {
      console.warn('Hero banner storage cleanup skipped:', error);
    }
  }

  await deleteDoc(doc(db, HERO_BANNER_COLLECTION, banner.id));
};

export const reorderHeroBanners = async (banners) => {
  const batch = writeBatch(db);

  banners.forEach((banner, index) => {
    batch.update(doc(db, HERO_BANNER_COLLECTION, banner.id), {
      displayOrder: index + 1,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};
