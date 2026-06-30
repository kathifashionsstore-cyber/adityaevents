// src/components/home/WhyChooseUs.jsx
import React from 'react';
import { Lightbulb, Target, Users, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const WhyChooseUs = () => {
  const scrollRef = useScrollAnimation();

  const features = [
    {
      icon: <Lightbulb className="w-6 h-6 text-primaryRose" />,
      title: 'Creative Concepts',
      desc: 'Bespoke designs curated specifically to tell your unique love story.'
    },
    {
      icon: <Target className="w-6 h-6 text-primaryRose" />,
      title: 'Attention to Detail',
      desc: 'Flawless execution where every floral petal and candle is placed with care.'
    },
    {
      icon: <Users className="w-6 h-6 text-primaryRose" />,
      title: 'Trusted Vendors',
      desc: 'Collaborations with premium local partners to guarantee top-tier service.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primaryRose" />,
      title: 'Stress Free Planning',
      desc: 'From initial layouts to on-site coordination, we handle every detail.'
    }
  ];

  return (
    <section ref={scrollRef} className="py-20 bg-background px-6 reveal-on-scroll relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Eyebrow & Title */}
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-body text-[10px] font-bold text-primaryRose tracking-[0.25em] uppercase mb-2">
            WHY CHOOSE US
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-textPrimary leading-tight">
            Planning Perfect Moments
          </h2>
          <div className="divider-gold" />
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 space-y-4">
              
              {/* Soft circular background */}
              <div className="w-14 h-14 rounded-full bg-primaryRose/10 border border-primaryRose/15 flex items-center justify-center shadow-sm shrink-0">
                {item.icon}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-textPrimary leading-snug">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-textSecondary leading-relaxed max-w-[240px] mx-auto">
                  {item.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
