// src/components/common/FloatingButtons.jsx
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppUrl } from '../../utils/whatsappHelper';

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const welcomeMessage = "Hello Adithya Event Management! I am interested in inquiring about event decor and catering packages.";
  const whatsappLink = getWhatsAppUrl('919393217676', welcomeMessage);

  return (
    <div className="fixed bottom-6 right-6 z-[490] flex flex-col space-y-3">
      {/* WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-emerald border border-gold/20 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-pulse-gold cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>

      {/* Scroll to Top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-burgundy/90 border border-gold/30 text-gold rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal hover:scale-110 transition-all duration-300 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
