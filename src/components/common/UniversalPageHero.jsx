// src/components/common/UniversalPageHero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
  'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=800'
];

const UniversalPageHero = ({
  title = 'Adithya Events',
  subtitle = 'Royal Celebrations',
  description = 'Crafting premium event memories, thematic stage backdrops, and exquisite catering services.',
  images = DEFAULT_IMAGES,
  breadcrumbs = []
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 2000); // 2 seconds auto-slide
    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="relative w-full min-h-[350px] md:min-h-[420px] bg-velvet border-b border-gold/15 overflow-hidden flex flex-col md:flex-row mt-[80px]">
      
      {/* LEFT PANEL: Autoplay Slideshow (50% width on md+) */}
      <div className="relative w-full h-[220px] md:h-auto md:w-1/2 overflow-hidden bg-black/10 shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[currentIdx] || DEFAULT_IMAGES[0]})` }}
          />
        </AnimatePresence>
        
        {/* Gradients to blend slide */}
        <div className="absolute inset-0 bg-gradient-to-t from-velvet via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-velvet/90" />
      </div>

      {/* RIGHT PANEL: Content & Info (50% width on md+) */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 md:px-12 md:py-16 text-left relative z-10 bg-velvet">
        
        {/* Background glow glow */}
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-royal/10 rounded-full blur-[90px] pointer-events-none -translate-y-1/2" />

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 font-body text-[10px] uppercase tracking-wider text-champagne/45 mb-4 relative z-10">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-gold/40 shrink-0" />
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-gold transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-gold/80 font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Text Area */}
        <div className="space-y-3 max-w-xl relative z-10">
          {subtitle && (
            <span className="font-accent text-2xl md:text-3xl text-gold block leading-none">
              {subtitle}
            </span>
          )}
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream tracking-wide uppercase leading-tight">
            {title}
          </h1>
          
          <div className="w-16 h-[2px] bg-gold rounded-full my-3" />
          
          <p className="font-body text-xs md:text-sm text-champagne/70 leading-relaxed font-light">
            {description}
          </p>
        </div>

      </div>

    </section>
  );
};

export default UniversalPageHero;
