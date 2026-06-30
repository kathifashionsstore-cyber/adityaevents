// src/components/home/TestimonialsSection.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from '../common/StarRating';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const scrollRef = useScrollAnimation();
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const snap = await getDocs(collection(db, 'testimonials'));
        const list = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setReviews(list.length > 0 ? list : FALLBACK_REVIEWS);
      } catch (e) {
        console.error("Testimonials load error:", e);
        setReviews(FALLBACK_REVIEWS);
      }
    };
    fetchReviews();
  }, []);

  const FALLBACK_REVIEWS = [
    {
      id: 'fallback-1',
      name: 'K. Rajasekhar Reddi',
      role: 'Wedding Ceremony',
      quote: 'Adithya Event Management made my daughter’s wedding absolutely magical. The stage decor in Vijayawada was royal and the food was praised by everyone. Exceeded all our expectations!',
      rating: 5
    },
    {
      id: 'fallback-2',
      name: 'G. Lakshmi Narasimha',
      role: 'Corporate Seminar',
      quote: 'Highly professional event organizers. They coordinated the light, sound, catering, and VIP seating for our seminar flawlessly. Recommend them for corporate and family functions.',
      rating: 5
    },
    {
      id: 'fallback-3',
      name: 'V. Satyanarayana',
      role: '1st Birthday Bash',
      quote: 'Superb decoration for our baby’s first birthday. The mascot and magic shows kept the kids engaged. Very reasonable rates in Krishna district.',
      rating: 5
    }
  ];

  const handleNext = () => {
    if (reviews.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    if (reviews.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section ref={scrollRef} className="py-24 bg-background text-textPrimary reveal-on-scroll relative overflow-hidden z-10">
      
      {/* Subtle organic SVG floral line art backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-primaryRose/[0.04] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path 
            d="M50,50 C40,25 15,35 30,55 C10,60 5,80 25,82 C38,92 62,92 75,82 C95,80 90,60 70,55 C85,35 60,25 50,50 Z M50,50 C40,40 45,55 50,50 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        
        {/* Eyebrow & Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-body text-[10px] font-bold text-primaryRose tracking-[0.25em] uppercase mb-2">
            TESTIMONIALS
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-textPrimary leading-tight">
            Client Stories
          </h2>
          <div className="divider-gold" />
        </div>

        {reviews.length > 0 && (
          <div className="w-full flex flex-col items-center relative">
            
            {/* The single quote carousel card */}
            <div className="relative w-full max-w-2xl bg-surface border border-border-soft rounded-3xl p-10 md:p-14 shadow-sm min-h-[280px] flex flex-col justify-between">
              
              {/* Gold Quote Mark Icon */}
              <div className="absolute top-6 left-8 text-accentGold/10">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              {/* Animated Text Block */}
              <div className="relative z-10 my-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="space-y-6"
                  >
                    <p className="font-display text-base sm:text-lg text-textPrimary leading-relaxed italic">
                      "{reviews[activeIndex].quote}"
                    </p>

                    <div className="flex flex-col items-center pt-2">
                      <StarRating rating={reviews[activeIndex].rating || 5} />
                      <h4 className="font-display text-sm font-bold text-primaryRose mt-4 leading-none">
                        {reviews[activeIndex].name}
                      </h4>
                      <span className="font-body text-[9px] text-textSecondary uppercase tracking-widest font-semibold mt-1.5">
                        {reviews[activeIndex].role}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Gold Quote Mark Bottom Right */}
              <div className="absolute bottom-6 right-8 text-accentGold/10">
                <Quote className="w-12 h-12" />
              </div>

              {/* Left/Right Arrow Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border-soft bg-surface text-textSecondary hover:text-primaryRose hover:border-primaryRose transition-colors cursor-pointer shadow-sm md:flex hidden"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border-soft bg-surface text-textSecondary hover:text-primaryRose hover:border-primaryRose transition-colors cursor-pointer shadow-sm md:flex hidden"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile bottom Arrow navigation */}
            <div className="flex justify-between w-full max-w-xs mt-6 md:hidden">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full border border-border-soft bg-surface text-textSecondary"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full border border-border-soft bg-surface text-textSecondary"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Carousel Navigation Dot Indicators */}
            <div className="flex space-x-2 mt-6">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? 'w-6 bg-primaryRose' : 'w-1.5 bg-primaryRose/35 hover:bg-primaryRose/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
