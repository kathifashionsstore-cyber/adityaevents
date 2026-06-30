// src/components/home/HeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeHeroSlides } from '../../services/heroSlidesService';
import { ChevronLeft, ChevronRight, MessageSquare, Calendar } from 'lucide-react';

const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600',
    title: 'Creating Royal',
    subtitle: 'Moments & Memories',
    description: 'Vijayawada’s premier wedding decorations, customized birthday themes, corporate events, and traditional gourmet catering feast providers.',
    btnText: 'Book Your Event',
    btnLink: '/booking'
  },
  {
    id: 'fallback-2',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600',
    title: 'Exquisite Traditional',
    subtitle: 'Andhra Gourmet Catering',
    description: 'Gourmet vegetarian curries and royal non-vegetarian spreads served by professional uniformed hosts.',
    btnText: 'View Packages',
    btnLink: '/packages'
  }
];

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const autoplayTimerRef = useRef(null);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    // Subscribe to Firestore heroSlides collection
    const unsubscribe = subscribeHeroSlides(
      (data) => {
        // filter active slides only
        const activeSlides = data.filter(slide => slide.isActive !== false);
        setSlides(activeSlides.length > 0 ? activeSlides : FALLBACK_SLIDES);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching hero slides:', error);
        setSlides(FALLBACK_SLIDES);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Autoplay Logic
  useEffect(() => {
    if (slides.length <= 1 || isHovered) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      handleNext();
    }, 4000); // 4 seconds interval for steady readability, crossfades every 4s

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [slides, isHovered, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (idx) => {
    setCurrentIndex(idx);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
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

  const currentSlide = slides[currentIndex] || FALLBACK_SLIDES[0];

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-velvet text-champagne select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slideshow Container with Ken Burns effect */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The Ken Burns zoom image */}
            <motion.img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 5.5, ease: 'linear' }}
              className="w-full h-full object-cover"
            />
            {/* Soft dark jewel purple backdrop overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-velvet via-velvet/65 to-velvet/40" />
            <div className="absolute inset-0 bg-black/35" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Slide Content Frame */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 pt-16 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-center space-y-6"
          >
            {/* Subtitle Badge */}
            {currentSlide.subtitle && (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/35 uppercase tracking-widest shadow-lg shadow-gold/5 animate-fadeIn">
                ⭐ {currentSlide.subtitle}
              </span>
            )}

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-ivory tracking-tight leading-[1.1] max-w-4xl">
              {currentSlide.title}
            </h1>

            {/* Description */}
            <p className="font-body text-sm sm:text-base text-champagne/85 max-w-2xl leading-relaxed">
              {currentSlide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto pt-4">
              {currentSlide.btnText ? (
                <Link
                  to={currentSlide.btnLink || '/booking'}
                  className="btn-premium btn-gold py-3 px-8 uppercase text-xs font-bold tracking-widest text-center shadow-lg shadow-gold/15 transition-transform hover:scale-[1.03]"
                >
                  {currentSlide.btnText}
                </Link>
              ) : (
                <Link
                  to="/booking"
                  className="btn-premium btn-gold py-3 px-8 uppercase text-xs font-bold tracking-widest text-center shadow-lg shadow-gold/15 transition-transform hover:scale-[1.03]"
                >
                  Request Booking
                </Link>
              )}
              
              <a
                href="https://wa.me/919393217676"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium btn-outline-gold py-3 px-8 uppercase text-xs font-bold tracking-widest text-center flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Designer</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Arrows */}
      {slides.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-gold/30 bg-velvet/40 text-gold hover:bg-gold hover:text-velvet transition-all cursor-pointer ${
              isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
            } md:block hidden`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-gold/30 bg-velvet/40 text-gold hover:bg-gold hover:text-velvet transition-all cursor-pointer ${
              isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
            } md:block hidden`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Always visible mobile bottom arrow navigation */}
          <div className="absolute bottom-16 w-full flex justify-between px-6 z-20 md:hidden">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-gold/30 bg-velvet/60 text-gold"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-gold/30 bg-velvet/60 text-gold"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-gold' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
