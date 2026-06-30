// src/components/home/PackageCircles.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const PackageCircles = () => {
  const scrollRef = useScrollAnimation();

  const circles = [
    {
      title: 'Royal Wedding',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
      link: '/services/wedding',
      color: 'from-gold/30 to-gold/5'
    },
    {
      title: 'Gourmet Catering',
      img: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=300&auto=format&fit=crop',
      link: '/services/catering',
      color: 'from-burgundy/30 to-burgundy/5'
    },
    {
      title: 'Theme Birthday',
      img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
      link: '/services/birthday',
      color: 'from-rose-gold/30 to-rose-gold/5'
    },
    {
      title: 'Corporate Gala',
      img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=300&auto=format&fit=crop',
      link: '/services/corporate',
      color: 'from-gold/20 to-champagne/5'
    }
  ];

  return (
    <section ref={scrollRef} className="py-20 bg-amethyst reveal-on-scroll">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ivory mb-2">
          Tailored Celebrations
        </h2>
        <p className="font-body text-xs sm:text-sm text-gold tracking-widest uppercase mb-16">
          Explore our premium event packages
        </p>

        {/* Circular layouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 justify-center items-center">
          {circles.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <Link to={item.link} className="relative flex flex-col items-center">
                {/* Outermost rotating circular gold frame */}
                <div className={`w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full p-[2px] bg-gradient-to-tr ${item.color} group-hover:rotate-180 transition-transform duration-700`}>
                  {/* Inside image circle */}
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-amethyst bg-amethyst relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-velvet/40 group-hover:bg-velvet/10 transition-colors" />
                  </div>
                </div>

                {/* Subtitle tag */}
                <h3 className="font-display text-sm font-semibold text-champagne group-hover:text-gold transition-colors mt-6 text-center">
                  {item.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageCircles;
