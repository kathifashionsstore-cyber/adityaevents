// src/components/home/HeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeHeroSlides } from '../../services/heroSlidesService';
import { ChevronLeft, ChevronRight, MessageSquare, Award, Sparkles, ThumbsUp, Gem, Loader2 } from 'lucide-react';

const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600',
    title: 'We Plan Your | Dream Event | beautifully',
    subtitle: 'Moments & Memories',
    description: 'Vijayawada’s premier wedding decorations, customized birthday themes, corporate events, and traditional gourmet catering feast providers.',
    btnText: 'Book Your Event',
    btnLink: '/booking'
  },
  {
    id: 'fallback-2',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600',
    title: 'Exquisite Traditional | gourmet catering | feeds & spreads',
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
    }, 4500); // Steady readability time

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
      <div className="w-full px-6 lg:px-16 pt-[100px] pb-6 bg-background flex flex-col items-center justify-center min-h-[500px]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-primaryRose animate-spin" />
          <span className="font-body text-xs text-primaryRose font-semibold tracking-widest uppercase">Loading royal experience...</span>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex] || FALLBACK_SLIDES[0];
  // Parse split title: segment 1 | segment 2 | segment 3
  const titleParts = currentSlide.title ? currentSlide.title.split('|').map(t => t.trim()) : [];

  return (
    <section 
      className="relative w-full px-6 lg:px-16 pt-[96px] pb-6 flex flex-col bg-background select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Rounded Slide Card Wrapper */}
      <div className="relative w-full min-h-[480px] md:h-[540px] rounded-[24px] overflow-hidden shadow-xl border border-primaryRose/15 bg-darkSection flex flex-col justify-end">
        
        {/* Background Ken Burns images */}
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
              <motion.img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 5.5, ease: 'linear' }}
                className="w-full h-full object-cover"
              />
              {/* Bottom-left overlay gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/45 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Content Frame */}
        <div className="relative z-10 w-full max-w-2xl text-left p-8 md:p-14 md:pb-16 flex flex-col items-start space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Subtitle Badge */}
              {currentSlide.subtitle && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-primaryRose/25 text-secondaryRoseGold border border-primaryRose/45 uppercase tracking-widest">
                  ✨ {currentSlide.subtitle}
                </span>
              )}

              {/* Headline Split Rendering */}
              {titleParts.length >= 2 ? (
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                  <span className="block text-white/70 uppercase text-[10px] font-body tracking-[0.25em] font-bold mb-2">
                    {titleParts[0]}
                  </span>
                  <span className="block text-secondaryRoseGold font-accent text-5xl sm:text-6xl capitalize leading-none my-1">
                    {titleParts[1]}
                  </span>
                  {titleParts[2] && (
                    <span className="block text-white font-display text-2xl sm:text-4xl mt-1.5 font-normal italic lowercase leading-tight">
                      {titleParts[2]}
                    </span>
                  )}
                </h1>
              ) : (
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  {currentSlide.title}
                </h1>
              )}

              {/* Description */}
              <p className="font-body text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
                {currentSlide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  to={currentSlide.btnLink || '/booking'}
                  className="btn-premium btn-gold py-2.5 px-6 uppercase text-[10px] font-bold tracking-widest text-center shadow-md hover:scale-[1.03]"
                >
                  {currentSlide.btnText || 'Plan Your Event →'}
                </Link>
                
                <a
                  href="https://wa.me/919393217676"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-outline-gold py-2.5 px-6 uppercase text-[10px] font-bold tracking-widest text-center flex items-center justify-center space-x-2 border-white/40 text-white hover:bg-white/5 hover:text-white"
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
            <button
              onClick={handlePrev}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-white/10 bg-black/30 text-white hover:bg-primaryRose hover:border-transparent transition-all cursor-pointer ${
                isHovered ? 'opacity-100' : 'opacity-0'
              } md:block hidden`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-white/10 bg-black/30 text-white hover:bg-primaryRose hover:border-transparent transition-all cursor-pointer ${
                isHovered ? 'opacity-100' : 'opacity-0'
              } md:block hidden`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 right-8 z-20 flex space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-primaryRose' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dark stats strip band below */}
      <div className="w-full bg-darkSection border border-primaryRose/10 py-5 px-6 md:px-12 rounded-[20px] mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-left shadow-md">
        
        {/* Stat Item 1 */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-white/5 border border-primaryRose/25 text-secondaryRoseGold rounded-full shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white leading-none">10+ Years</p>
            <p className="font-body text-[9px] text-white/50 uppercase tracking-widest mt-1">Decor Experience</p>
          </div>
        </div>

        {/* Stat Item 2 */}
        <div className="flex items-center space-x-3.5 border-l border-white/10 pl-4 md:pl-6">
          <div className="p-2 bg-white/5 border border-primaryRose/25 text-secondaryRoseGold rounded-full shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white leading-none">500+ Events</p>
            <p className="font-body text-[9px] text-white/50 uppercase tracking-widest mt-1">Executed Safely</p>
          </div>
        </div>

        {/* Stat Item 3 */}
        <div className="flex items-center space-x-3.5 border-t border-white/10 pt-4 md:pt-0 md:border-t-0 md:border-l pl-0 md:pl-6">
          <div className="p-2 bg-white/5 border border-primaryRose/25 text-secondaryRoseGold rounded-full shrink-0">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white leading-none">100% Happy</p>
            <p className="font-body text-[9px] text-white/50 uppercase tracking-widest mt-1">Client Reviews</p>
          </div>
        </div>

        {/* Stat Item 4 */}
        <div className="flex items-center space-x-3.5 border-t border-white/10 pt-4 md:pt-0 md:border-t-0 md:border-l pl-0 md:pl-6">
          <div className="p-2 bg-white/5 border border-primaryRose/25 text-secondaryRoseGold rounded-full shrink-0">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white leading-none">Premium Quality</p>
            <p className="font-body text-[9px] text-white/50 uppercase tracking-widest mt-1">Gourmet Catering</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
