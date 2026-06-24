// src/components/home/GallerySection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, limit, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LazyImage from '../common/LazyImage';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const GallerySection = () => {
  const scrollRef = useScrollAnimation();
  const [photos, setPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

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
        setPhotos(list.slice(0, 6)); // Limit preview to 6 items
      } catch (e) {
        console.error("Gallery section load error:", e);
        // Fallback default photos
        setPhotos([
          { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400', category: 'wedding' },
          { src: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400', category: 'catering' },
          { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400', category: 'birthday' },
          { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400', category: 'corporate' }
        ]);
      }
    };
    fetchPhotos();
  }, [activeFilter]);

  return (
    <section ref={scrollRef} className="py-24 bg-charcoal text-champagne reveal-on-scroll">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="text-center md:text-left">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ivory mb-2">
              Captured Moments
            </h2>
            <p className="font-body text-xs sm:text-sm text-gold tracking-widest uppercase">
              Actual event decoration & catering showcases
            </p>
          </div>
          <Link to="/gallery" className="mt-4 md:mt-0 btn-premium btn-outline-gold py-2 px-6 text-xs uppercase font-semibold">
            View All Gallery
          </Link>
        </div>

        {/* Filters */}
        <div className="flex justify-center space-x-3 mb-10 overflow-x-auto pb-2">
          {['all', 'wedding', 'catering', 'birthday', 'corporate'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-gold text-charcoal'
                  : 'bg-white/5 hover:bg-white/10 text-champagne border border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((p, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-lg overflow-hidden group border border-white/5 hover:border-gold/30 transition-all duration-300"
            >
              <LazyImage
                src={p.src}
                alt={p.category}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="font-body text-[10px] text-gold uppercase tracking-wider">
                  {p.category}
                </span>
                <h4 className="font-display text-sm font-semibold text-ivory mt-1">
                  {p.caption || 'Royal Event Decor'}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
