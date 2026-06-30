// src/components/home/EventsCircleSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const eventCategories = [
  { slug: 'wedding', label: 'Wedding', emoji: '💍', desc: 'Royal & Traditional Mandapams' },
  { slug: 'catering', label: 'Premium Catering', emoji: '🍲', desc: 'Delicious Multi-cuisine Feast' },
  { slug: 'birthday', label: 'Birthdays', emoji: '🎂', desc: 'Fun Themed Birthday Bashes' },
  { slug: 'engagement', label: 'Engagement', emoji: '🤝', desc: 'Elegant Ring Ceremony Setups' },
  { slug: 'receptions', label: 'Receptions', emoji: '🥂', desc: 'Grand Couple Entry & Stages' },
  { slug: 'mehndi', label: 'Mehndi Night', emoji: '🎶', desc: 'Colorful & Festive Sangeet Nights' },
  { slug: 'dj-events', label: 'DJ Events', emoji: '🎧', desc: 'High-energy Sound & Light Shows' },
  { slug: 'photography', label: 'Photography', emoji: '📸', desc: 'Candid & Cinematic Moments' },
  { slug: 'stage-decor', label: 'Stage Decor', emoji: '🏛️', desc: 'Thematic Backdrop & Floral Work' },
  { slug: 'corporate', label: 'Corporate', emoji: '💼', desc: 'Professional Meets & Conferences' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  }
};

const EventsCircleSection = () => {
  return (
    <section className="py-20 bg-velvet text-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-royal/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto mb-16">
          <span className="font-accent text-3xl text-gold block mb-2">Our Specialities</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
            Curated Celebrations for Every Occasion
          </h2>
          <p className="font-body text-xs md:text-sm text-champagne/70 leading-relaxed">
            From royal Telugu weddings and traditional mandapams to high-energy DJ parties and premium catering, we turn your dreams into unforgettable memories. Select an event type to view details and past galleries.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 justify-items-center"
        >
          {eventCategories.map((category) => (
            <motion.div
              key={category.slug}
              variants={itemVariants}
              className="flex flex-col items-center group cursor-pointer"
            >
              <Link to={`/events/${category.slug}`} className="flex flex-col items-center">
                {/* Circle Container */}
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-amethyst border border-gold/20 hover:border-gold/50 shadow-lg shadow-black/20 transition-all duration-300">
                  {/* Rotating Gold Accent Ring on Hover */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/0 group-hover:border-gold/40 group-hover:animate-[spin_10s_linear_infinite] transition-all duration-500" />
                  
                  {/* Outer Glow on Hover */}
                  <div className="absolute inset-0 rounded-full bg-gold/0 group-hover:bg-gold/5 blur-sm transition-all duration-300" />

                  {/* Emoji Icon */}
                  <span className="text-3xl relative z-10 transition-transform duration-300 group-hover:scale-125 select-none">
                    {category.emoji}
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="font-display text-sm font-semibold text-cream group-hover:text-gold transition-colors duration-200">
                  {category.label}
                </h3>
                
                {/* Micro Description */}
                <span className="font-body text-[10px] text-champagne/50 mt-1 max-w-[120px] leading-tight block">
                  {category.desc}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EventsCircleSection;
