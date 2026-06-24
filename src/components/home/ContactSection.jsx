// src/components/home/ContactSection.jsx
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import DualContactCard from './DualContactCard';

const ContactSection = () => {
  const scrollRef = useScrollAnimation();

  return (
    <section ref={scrollRef} id="contact" className="py-24 px-6 bg-amethyst/10 relative reveal-on-scroll border-t border-white/5">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-royal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <DualContactCard />
      </div>
    </section>
  );
};

export default ContactSection;
