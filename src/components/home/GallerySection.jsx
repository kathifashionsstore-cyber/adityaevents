// src/components/home/GallerySection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LazyImage from '../common/LazyImage';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';

const GallerySection = () => {
  const scrollRef = useScrollAnimation();
  const [photos, setPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchPhotos = async () => {
      let q = collection(db, 'gallery');
      let constraints = [where('isActive', '==', true), where('isFeatured', '==', true)];
      if (activeFilter !== 'all') {
        constraints.push(where('category', '==', activeFilter));
      }
      q = query(q, ...constraints);
      try {
        let snap = await getDocs(q);
        if (snap.empty) {
          let fallbackQ = collection(db, 'gallery');
          let fallbackConstraints = [where('isActive', '==', true)];
          if (activeFilter !== 'all') {
            fallbackConstraints.push(where('category', '==', activeFilter));
          }
          fallbackQ = query(fallbackQ, ...fallbackConstraints);
          snap = await getDocs(fallbackQ);
        }
        const list = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPhotos(list.slice(0, 4)); // Row of exactly 4 photos
      } catch (e) {
        console.error("Gallery section load error:", e);
        setPhotos([
          { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600', category: 'wedding' },
          { src: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600', category: 'catering' },
          { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600', category: 'birthday' },
          { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600', category: 'corporate' }
        ]);
      }
    };
    fetchPhotos();
  }, [activeFilter]);

  return (
    <section ref={scrollRef} className="py-20 bg-background text-textPrimary reveal-on-scroll relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-body text-[10px] font-bold text-primaryRose tracking-[0.25em] uppercase mb-2">
            GALLERY HIGHLIGHTS
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-textPrimary leading-tight">
            Captured Moments
          </h2>
          <div className="divider-gold" />
        </div>

        {/* Filter Badges */}
        <div className="flex justify-center space-x-2.5 mb-10 overflow-x-auto pb-2">
          {['all', 'wedding', 'catering', 'birthday', 'corporate'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-primaryRose text-white shadow-sm'
                  : 'bg-primaryRose/5 hover:bg-primaryRose/10 text-primaryRose border border-primaryRose/15'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 4-Image Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((p, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-border-soft hover:shadow-md hover:border-primaryRose/35 transition-all duration-300"
            >
              <LazyImage
                src={p.src}
                alt={p.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                <span className="font-body text-[9px] text-secondaryRoseGold uppercase tracking-widest font-bold">
                  {p.category}
                </span>
                <h4 className="font-display text-xs font-semibold text-white mt-1">
                  {p.caption || 'Adithya Event Decor'}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Center Ghost Link Below Grid */}
        <div className="flex justify-center mt-12">
          <Link 
            to="/gallery" 
            className="btn-ghost-rose text-xs font-bold tracking-widest uppercase flex items-center group/btn"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default GallerySection;
