// src/components/home/ServicesSection.jsx
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Camera, Utensils, Sparkles, Music } from 'lucide-react';
import Card from '../common/Card';

const ServicesSection = () => {
  const scrollRef = useScrollAnimation();

  const services = [
    {
      icon: <Sparkles className="w-8 h-8 text-gold" />,
      title: 'Royal Stage Decorations',
      desc: 'Bespoke, cinematic backdrops, fresh flower arches, and royal mandapam setups tailored to capture wedding themes.'
    },
    {
      icon: <Utensils className="w-8 h-8 text-gold" />,
      title: 'Premium Local Catering',
      desc: 'Traditional Andhra style vegetarian meals and grand multi-cuisine non-vegetarian buffets prepared by expert chefs.'
    },
    {
      icon: <Camera className="w-8 h-8 text-gold" />,
      title: 'Candid Media Coverage',
      desc: 'Professional candid photographers, high-definition videography, and 4K aerial drone shoots to preserve every event detail.'
    },
    {
      icon: <Music className="w-8 h-8 text-gold" />,
      title: 'High-End Audio & DJ',
      desc: 'Premium sound systems, club lights, and professional DJs to host wedding receptions, engagements, and birthday parties.'
    }
  ];

  return (
    <section ref={scrollRef} className="py-24 bg-charcoal/5 px-6 reveal-on-scroll relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-primary mb-2">
            Signature Services
          </h2>
          <p className="font-body text-xs sm:text-sm text-gold tracking-widest uppercase">
            Designed for unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col items-start p-8" hoverEffect>
              <div className="p-3 bg-white/5 border border-gold/15 rounded-lg mb-6">
                {service.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-champagne mb-3">
                {service.title}
              </h3>
              <p className="font-body text-xs text-champagne/70 leading-relaxed">
                {service.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
