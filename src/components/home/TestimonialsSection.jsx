// src/components/home/TestimonialsSection.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import Card from '../common/Card';
import StarRating from '../common/StarRating';

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
        setReviews(list.slice(0, 3));
      } catch (e) {
        // Fallback default feedback
        setReviews([
          {
            name: 'K. Rajasekhar Reddi',
            role: 'Father of the Bride',
            quote: 'Adithya Event Management made my daughter’s wedding absolutely magical. The stage decor in Vuyyuru was royal and the food was praised by everyone. Exceeded all our expectations!',
            rating: 5
          },
          {
            name: 'G. Lakshmi Narasimha',
            role: 'Corporate Host',
            quote: 'Highly professional event organizers. They coordinated the light, sound, catering, and VIP seating for our seminar flawlessly. Recommend them for corporate and family functions.',
            rating: 5
          },
          {
            name: 'V. Satyanarayana',
            role: 'Birthday Inquirer',
            quote: 'Superb decoration for our baby’s first birthday. The mascot and magic shows kept the kids engaged. Very reasonable rates in Krishna district.',
            rating: 5
          }
        ]);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section ref={scrollRef} className="py-24 bg-charcoal/5 px-6 reveal-on-scroll">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-primary mb-2">
            Client Stories
          </h2>
          <p className="font-body text-xs sm:text-sm text-gold tracking-widest uppercase">
            Honest feedback from local families
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="flex flex-col items-center">
            {/* Feedback quotes block */}
            <Card className="p-10 w-full relative" hoverEffect={false}>
              <div className="absolute top-4 left-6 text-6xl text-gold/20 font-serif">“</div>
              <p className="font-body text-base text-champagne/90 leading-relaxed italic mb-6">
                {reviews[activeIndex].quote}
              </p>
              
              <div className="flex flex-col items-center">
                <StarRating rating={reviews[activeIndex].rating || 5} />
                <h4 className="font-display text-sm font-bold text-gold mt-4">
                  {reviews[activeIndex].name}
                </h4>
                <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest mt-0.5">
                  {reviews[activeIndex].role}
                </span>
              </div>
            </Card>

            {/* Slider Dots */}
            <div className="flex space-x-2 mt-8">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === idx ? 'bg-gold w-6' : 'bg-gold/30 hover:bg-gold/50'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
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
