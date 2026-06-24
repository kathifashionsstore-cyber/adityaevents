export const HERO_BANNER_COLLECTION = 'heroBanners';
export const HERO_BANNER_STORAGE_ROOT = 'heroBanners';

export const DEFAULT_HERO_BANNER_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop';

export const HERO_BANNER_PAGES = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'leaders', label: 'Leaders', path: '/leaders' },
  { key: 'daily-work', label: 'Daily Work', path: '/daily-work' },
  { key: 'super-6', label: 'Super 6', path: '/super-6' },
  { key: 'schemes', label: 'Schemes', path: '/schemes' },
  { key: 'gallery', label: 'Gallery', path: '/gallery' },
  { key: 'news', label: 'News', path: '/news' },
  { key: 'narasaraopet', label: 'Narasaraopet', path: '/narasaraopet' },
  { key: 'contact', label: 'Contact', path: '/contact' },
];

export const getHeroBannerPage = (pageKey) =>
  HERO_BANNER_PAGES.find((page) => page.key === pageKey) || HERO_BANNER_PAGES[0];

export const getHeroBannerPageLabel = (pageKey) => getHeroBannerPage(pageKey).label;
