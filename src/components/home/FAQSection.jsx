// src/components/home/FAQSection.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const FAQSection = () => {
  const scrollRef = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'Do you charge a flat decoration fee or package rate?',
      a: 'We offer standardized pricing packages starting from ₹1,50,000 for classic wedding decorations, as well as customizable quotes for clients with bespoke stage needs.'
    },
    {
      q: 'Is catering included in your decoration packages?',
      a: 'Catering can be bundled with decoration services. Our catering rates are based per plate: starting from ₹350/plate for vegetarian dishes and ₹550/plate for non-vegetarian menus.'
    },
    {
      q: 'Do you support events outside Vuyyuru?',
      a: 'Yes, we handle weddings and banquets throughout Vuyyuru, Vijayawada, Krishna District, and adjacent regions in Andhra Pradesh.'
    },
    {
      q: 'What is your booking cancellation policy?',
      a: 'We require a 50% advance to confirm slot bookings. Cancellations made 30 days prior to the event date receive a full refund, while later cancellations forfeit the deposit.'
    }
  ];

  return (
    <section ref={scrollRef} className="py-24 bg-charcoal text-champagne reveal-on-scroll">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-ivory mb-2">
            Frequently Asked
          </h2>
          <p className="font-body text-xs sm:text-sm text-gold tracking-widest uppercase">
            Quick answers to your event planning queries
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-white/5 rounded-lg overflow-hidden bg-white/5"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-display text-sm font-semibold tracking-wide cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 border-t border-white/5 p-5' : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <p className="font-body text-xs text-champagne/70 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
