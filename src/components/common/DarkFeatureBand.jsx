// src/components/common/DarkFeatureBand.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const DarkFeatureBand = ({
  title = "A Touch of Luxury in Every Detail",
  description = "We combine royal stage backdrops, fresh flower decorations, cinematic media coverage, and gourmet local catering spreads to bring your dream celebration to life.",
  btnText = "Discover More",
  btnLink = "/contact",
  bgImage = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200"
}) => {
  const scrollRef = useScrollAnimation();

  return (
    <section 
      ref={scrollRef}
      className="relative py-20 bg-darkSection overflow-hidden text-center reveal-on-scroll z-10"
    >
      {/* Background Image Overlay with low opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="luxury detail overlay" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-darkSection/85" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          {title}
        </h2>
        
        <p className="font-body text-xs sm:text-sm text-secondaryRoseGold/85 max-w-2xl leading-relaxed">
          {description}
        </p>

        <div className="pt-2">
          <Link
            to={btnLink}
            className="btn-premium btn-gold text-[10px] uppercase font-bold tracking-widest px-8 py-3"
          >
            {btnText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DarkFeatureBand;
