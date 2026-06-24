// src/pages/public/GalleryPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import HeroBannerCarousel from '../../components/common/HeroBannerCarousel';
import useAnalytics from '../../hooks/useAnalytics';
import LazyImage from '../../components/common/LazyImage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const GalleryPage = () => {
  useAnalytics('gallery');
  const [photos, setPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      let q = collection(db, 'gallery');
      if (activeFilter !== 'all') {
        q = query(q, where('category', '==', activeFilter));
      }
      try {
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPhotos(list);
      } catch (e) {
        // Fallback default photos
        setPhotos([
          { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400', category: 'wedding', caption: 'Classic Stage Decor Vuyyuru' },
          { src: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400', category: 'catering', caption: 'Buffet Platter feasts' },
          { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400', category: 'birthday', caption: 'Magical birthday balloon setups' },
          { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400', category: 'corporate', caption: 'Corporate seminar layouts' }
        ]);
      }
    };
    fetchPhotos();
  }, [activeFilter]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <PageTransition>
      <SEOHead pageKey="gallery" />
      <HeroBannerCarousel
        pageKey="gallery"
        title="Our Work Gallery"
        subtitle="Decors and buffet catering moments"
      />
      <div className="py-16 px-6 max-w-5xl mx-auto">

        {/* Filters */}
        <div className="flex justify-center space-x-3 mb-12 overflow-x-auto pb-2">
          {['all', 'wedding', 'catering', 'birthday', 'corporate'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-gold text-velvet'
                  : 'bg-white/5 hover:bg-white/10 text-champagne border border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((p, idx) => (
            <div
              key={p.id || idx}
              onClick={() => openLightbox(idx)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-white/5 hover:border-gold/30 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <LazyImage
                src={p.src}
                alt={p.caption || 'Event image'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                <span className="font-body text-[10px] text-gold uppercase tracking-wider">
                  {p.category}
                </span>
                <h4 className="font-display text-sm font-semibold text-ivory mt-1">
                  {p.caption || 'Royal Setup'}
                </h4>
                <div className="absolute top-4 right-4 p-2 bg-velvet/80 rounded-full border border-white/10 text-gold scale-75 group-hover:scale-100 transition-transform">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-champagne hover:text-gold p-1 cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 p-2 rounded-full bg-white/5 border border-white/10 text-gold hover:bg-white/10 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image display */}
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].caption}
                className="max-w-full max-h-[70vh] object-contain rounded border border-gold/15"
              />
              <p className="font-display text-base font-semibold text-gold mt-4">
                {photos[lightboxIndex].caption || 'Adithya Event Decor'}
              </p>
              <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest mt-1">
                {photos[lightboxIndex].category}
              </span>
            </div>

            <button
              onClick={nextPhoto}
              className="absolute right-4 p-2 rounded-full bg-white/5 border border-white/10 text-gold hover:bg-white/10 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default GalleryPage;
