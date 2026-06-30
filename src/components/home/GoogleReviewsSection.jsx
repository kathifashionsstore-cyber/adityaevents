// src/components/home/GoogleReviewsSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_REVIEWS = [
  {
    id: 'fallback-rev-1',
    authorName: 'Satish Rao',
    rating: 5,
    relativeTimeDescription: '2 weeks ago',
    text: 'Adithya Event Management made our wedding reception in Vijayawada absolutely royal. The stage flowers were fresh and the guest hospitality was excellent!',
    authorPhotoUrl: 'https://ui-avatars.com/api/?name=Satish+Rao&background=D4AF37&color=1C0A2E'
  },
  {
    id: 'fallback-rev-2',
    authorName: 'Niharika Chennupati',
    rating: 5,
    relativeTimeDescription: 'a month ago',
    text: 'Impeccable catering service! Their Traditional Veg Feast was praised by all our guests. Highly recommend them for family celebrations.',
    authorPhotoUrl: 'https://ui-avatars.com/api/?name=Niharika+Chennupati&background=D4AF37&color=1C0A2E'
  },
  {
    id: 'fallback-rev-3',
    authorName: 'Vikram Dev',
    rating: 5,
    relativeTimeDescription: '3 weeks ago',
    text: 'Professional crew, eye-catching LED walls, and smooth execution. They managed everything from stage backdrop to photography without any stress.',
    authorPhotoUrl: 'https://ui-avatars.com/api/?name=Vikram+Dev&background=D4AF37&color=1C0A2E'
  }
];

const GoogleReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: '4.9', totalReviewsCount: '120+' });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimerRef = useRef(null);

  useEffect(() => {
    // 1. Listen to curated reviews
    const unsubscribeReviews = onSnapshot(
      collection(db, 'googleReviews'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setReviews(list);
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading reviews:', error);
        setReviews(DEFAULT_REVIEWS);
        setLoading(false);
      }
    );

    // 2. Listen to summary configuration
    const unsubscribeSummary = onSnapshot(
      doc(db, 'siteConfig', 'googleReviewsSummary'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSummary(snapshot.data());
        }
      }
    );

    return () => {
      unsubscribeReviews();
      unsubscribeSummary();
    };
  }, []);

  // Slowly auto-scroll reviews every 3 seconds
  useEffect(() => {
    if (reviews.length <= 1 || isHovered) {
      if (scrollTimerRef.current) clearInterval(scrollTimerRef.current);
      return;
    }

    scrollTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 3500);

    return () => {
      if (scrollTimerRef.current) clearInterval(scrollTimerRef.current);
    };
  }, [reviews, isHovered]);

  if (loading) return null;

  return (
    <section 
      className="py-24 bg-velvet text-champagne relative overflow-hidden border-t border-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Rating summary badge */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-body text-[10px] text-gold tracking-widest uppercase mb-2 font-semibold">
            Social Proof & Trust
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ivory mb-6">
            Loved By Our Clients
          </h2>

          {/* Premium Google Badge */}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white/5 border border-gold/25 rounded-2xl px-6 py-4 hover:bg-white/10 transition-all cursor-pointer shadow-lg shadow-gold/5"
          >
            {/* Google G Logo */}
            <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-4">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.62v3.01h3.87c2.26-2.08 3.58-5.14 3.58-8.48z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.01c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11C3.26 21.84 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.28A7.18 7.18 0 0 1 4.9 12c0-.79.13-1.57.37-2.28V6.61H1.29A11.95 11.95 0 0 0 0 12c0 1.92.45 3.74 1.29 5.39l3.98-3.11z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.16 1.29 5.39l3.98 3.11c.95-2.85 3.6-4.75 6.71-4.75z"
                />
              </svg>
              <span className="font-display font-bold text-champagne">Google</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-gold text-lg">{summary.averageRating}</span>
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold shrink-0" />
                ))}
              </div>
              <span className="font-body text-xs text-champagne/60">({summary.totalReviewsCount} reviews)</span>
            </div>
          </a>
        </div>

        {/* CURATED REVIEWS CAROUSEL CONTAINER */}
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="min-h-[160px] flex items-center justify-center">
            {reviews.length > 0 && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="flex flex-col items-center space-y-4 text-center"
              >
                {/* Author Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src={reviews[currentIndex].authorPhotoUrl}
                    alt={reviews[currentIndex].authorName}
                    className="w-12 h-12 rounded-full border border-gold/30 object-cover shrink-0 shadow-lg"
                  />
                  <div className="text-left">
                    <h4 className="font-display font-bold text-champagne text-base">
                      {reviews[currentIndex].authorName}
                    </h4>
                    <span className="text-[10px] text-champagne/50">
                      {reviews[currentIndex].relativeTimeDescription}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex text-gold">
                  {Array.from({ length: Number(reviews[currentIndex].rating) || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold shrink-0" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-body text-xs sm:text-sm text-champagne/85 leading-relaxed max-w-2xl italic">
                  "{reviews[currentIndex].text}"
                </p>
              </motion.div>
            )}
          </div>

          {/* Navigation indicator dots */}
          {reviews.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-gold' : 'w-1.5 bg-white/20'
                  }`}
                  title={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default GoogleReviewsSection;
