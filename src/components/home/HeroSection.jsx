// src/components/home/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';
import HeroBannerCarousel from '../common/HeroBannerCarousel';

const DEFAULT_HERO_DATA = {
  badge: '⭐ #1 Event Management & Decor in Vuyyuru',
  title: 'Creating Royal',
  titleAccent: 'Moments & Memories',
  description: 'Vuyyuru’s premier wedding decorations, customized birthday themes, corporate events, and traditional gourmet catering feast providers.',
  ctaPrimary: { label: 'Book Your Event', link: '/booking' },
  ctaSecondary: { label: 'View Gallery', link: '/gallery' },
  stats: [
    { value: '500', suffix: '+', label: 'Events Completed' },
    { value: '10', suffix: '+', label: 'Years Experience' },
    { value: '50000', suffix: '+', label: 'Guests Served' },
    { value: '98', suffix: '%', label: 'Satisfaction' },
  ],
  isVideo: false,
};

const HeroSection = () => {
  const [dbHeroData, setDbHeroData] = useState(DEFAULT_HERO_DATA);
  const [loading, setLoading] = useState(true);
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'siteConfig', 'hero'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data) {
            setDbHeroData({
              ...DEFAULT_HERO_DATA,
              ...data,
              ctaPrimary: { ...DEFAULT_HERO_DATA.ctaPrimary, ...(data.ctaPrimary || {}) },
              ctaSecondary: { ...DEFAULT_HERO_DATA.ctaSecondary, ...(data.ctaSecondary || {}) },
              stats: Array.isArray(data.stats) ? data.stats : DEFAULT_HERO_DATA.stats,
            });
          } else {
            setDbHeroData(DEFAULT_HERO_DATA);
          }
        } else {
          setDbHeroData(DEFAULT_HERO_DATA);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Hero database fetch error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  };

  if (loading) {
    return (
      <div className="h-screen bg-charcoal flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <span className="font-body text-xs text-gold tracking-widest uppercase">Loading royal experience...</span>
        </div>
      </div>
    );
  }

  const heroData = dbHeroData || DEFAULT_HERO_DATA;

  return (
    <HeroBannerCarousel pageKey="home" variant="home">
      {/* Main Contents Frame */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 pt-16 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center space-y-6"
        >
          {/* Badge */}
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/35 uppercase tracking-widest shadow-lg shadow-gold/5"
          >
            {heroData.badge}
          </motion.span>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-ivory tracking-tight leading-[1.1]"
          >
            {heroData.title} <br />
            <span className="font-accent text-gold text-5xl sm:text-7xl lg:text-8xl tracking-wider block mt-2">
              {heroData.titleAccent}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-body text-sm sm:text-base text-champagne/80 max-w-2xl leading-relaxed mt-2"
          >
            {heroData.description}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4"
          >
            <Link
              to={heroData.ctaPrimary.link}
              className="btn-premium btn-gold py-3 px-8 uppercase text-xs font-bold tracking-widest text-center"
            >
              {heroData.ctaPrimary.label}
            </Link>
            <Link
              to={heroData.ctaSecondary.link}
              className="btn-premium btn-outline-gold py-3 px-8 uppercase text-xs font-bold tracking-widest text-center"
            >
              {heroData.ctaSecondary.label}
            </Link>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            variants={itemVariants}
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-4xl pt-12 mt-6 border-t border-white/5"
          >
            {heroData.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-display text-3xl sm:text-4xl font-bold text-gold flex items-center">
                  {statsInView ? (
                    <CountUp end={parseInt(stat.value)} duration={2.5} separator="," />
                  ) : (
                    '0'
                  )}
                  <span className="text-gold/80">{stat.suffix || '+'}</span>
                </span>
                <span className="font-body text-[10px] sm:text-xs text-champagne/60 uppercase tracking-widest mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Chevron */}
        <div className="absolute bottom-6 flex justify-center animate-bounce">
          <ChevronDown className="w-6 h-6 text-gold" />
        </div>
      </div>
    </HeroBannerCarousel>
  );
};

export default HeroSection;
