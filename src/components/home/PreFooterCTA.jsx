// src/components/home/PreFooterCTA.jsx
import React, { useState } from 'react';
import { Calendar, CheckCheck, MessageSquare } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const PreFooterCTA = () => {
  const scrollRef = useScrollAnimation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div ref={scrollRef} className="reveal-on-scroll relative z-10 w-full">
      
      {/* Dusty-Rose Tinted Stats Strip */}
      <div className="w-full bg-[#FFF0F2] border-y border-primaryRose/15 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-primaryRose">500+</p>
            <p className="font-body text-[10px] text-textSecondary uppercase tracking-widest font-bold mt-1.5">Happy Celebrations</p>
          </div>
          <div className="border-t md:border-t-0 md:border-x border-primaryRose/15 py-4 md:py-0">
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-primaryRose">100%</p>
            <p className="font-body text-[10px] text-textSecondary uppercase tracking-widest font-bold mt-1.5">Satisfaction Rate</p>
          </div>
          <div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-primaryRose">10,000+</p>
            <p className="font-body text-[10px] text-textSecondary uppercase tracking-widest font-bold mt-1.5">Guests Served Gourmet Food</p>
          </div>
        </div>
      </div>

      {/* Pre-footer Closing CTA Block */}
      <section className="py-24 bg-background text-center px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center space-y-8">
          
          {/* Top: Outlined Event Badge */}
          <div className="inline-flex items-center space-x-2 px-4.5 py-2 rounded-full border-2 border-primaryRose/35 text-primaryRose bg-surface shadow-sm">
            <Calendar className="w-4 h-4" />
            <span className="font-body text-[9px] font-bold uppercase tracking-widest">
              Available 365 Days • Est. 2015
            </span>
          </div>

          {/* Middle: Headline & Subtitle */}
          <div className="space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-textPrimary leading-tight">
              Let’s Create Your Royal Celebration
            </h2>
            <p className="font-body text-xs sm:text-sm text-textSecondary max-w-xl mx-auto leading-relaxed">
              Contact our design specialists today to claim a customized stage decoration pre-visualization layout and catering menu consultation.
            </p>
          </div>

          {/* Bottom: WhatsApp Consult button with double checkmark on hover */}
          <div className="pt-2">
            <a
              href="https://wa.me/919393217676?text=Hi%20Adithya%20Events,%20I%27d%20like%20to%20consult%20with%20your%20team%20about%20my%20upcoming%20event."
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:shadow-lg hover:shadow-green-500/20 px-10 py-4.5 rounded-full font-body font-bold text-[10px] uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Consult with Our Team</span>
              <span className="w-4 h-4 flex items-center justify-center transition-all duration-300">
                {isHovered ? (
                  <CheckCheck className="w-4.5 h-4.5 text-white animate-pulse" />
                ) : (
                  <CheckCheck className="w-4.5 h-4.5 text-white/50" />
                )}
              </span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};

export default PreFooterCTA;
