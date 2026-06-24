import { useEffect, useMemo, useState } from 'react';
import { subscribeHeroBanners } from '../services/heroBannerService';
import {
  DEFAULT_HERO_BANNER_IMAGE,
  getHeroBannerPageLabel,
} from '../utils/heroBannerPages';

export const useHeroBanners = (pageKey, options = {}) => {
  const { activeOnly = true } = options;
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeHeroBanners(
      pageKey,
      { activeOnly },
      (items) => {
        setBanners(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Hero banners fetch failed for ${pageKey}:`, err);
        setError(err);
        setBanners([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [activeOnly, pageKey]);

  const slides = useMemo(() => {
    if (banners.length > 0) {
      return banners;
    }

    return [
      {
        id: `${pageKey}-fallback`,
        page: pageKey,
        title: `${getHeroBannerPageLabel(pageKey)} Banner`,
        imageUrl: DEFAULT_HERO_BANNER_IMAGE,
        isActive: true,
        displayOrder: 1,
        isFallback: true,
      },
    ];
  }, [banners, pageKey]);

  return {
    banners,
    slides,
    loading,
    error,
    hasCustomBanners: banners.length > 0,
  };
};

export default useHeroBanners;
