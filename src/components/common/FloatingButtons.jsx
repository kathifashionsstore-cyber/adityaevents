// src/components/common/FloatingButtons.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, MessageCircle, X, ChevronUp } from 'lucide-react';

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  const triggerChatbot = () => {
    window.dispatchEvent(new CustomEvent('toggle-chatbot'));
    setExpanded(false);
  };

  const subButtons = [
    {
      id: 'whatsapp',
      label: 'WhatsApp Chat',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-600 border border-green-500/20 text-white',
      onClick: () => {
        const welcomeMessage = "Hello Adithya Event Management! I am interested in inquiring about event decor and catering packages.";
        window.open(`https://wa.me/919393217676?text=${encodeURIComponent(welcomeMessage)}`, '_blank');
        setExpanded(false);
      }
    },
    {
      id: 'call',
      label: 'Call Coordinator',
      icon: <Phone className="w-5 h-5" />,
      color: 'bg-blue-600 border border-blue-500/20 text-white',
      onClick: () => {
        window.open('tel:+919393217676', '_self');
        setExpanded(false);
      }
    },
    {
      id: 'chatbot',
      label: 'AI Event Assistant',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-purple-600 border border-purple-500/20 text-white',
      onClick: triggerChatbot
    }
  ];

  return (
    <>
      {/* 1. BOTTOM LEFT: Social Brand Stack */}
      <div className="fixed bottom-20 left-6 z-[490] flex flex-col space-y-3.5 items-center md:bottom-8 select-none">
        {/* Instagram */}
        <a
          href="https://instagram.com/adithya_event_management"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/5 border border-gold/20 flex items-center justify-center text-champagne hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-115 transition-all duration-300 shadow-lg cursor-pointer"
          title="Follow us on Instagram"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/5 border border-gold/20 flex items-center justify-center text-champagne hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-115 transition-all duration-300 shadow-lg cursor-pointer"
          title="Follow us on Facebook"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
        </a>
      </div>

      {/* 2. BOTTOM RIGHT: Expanded FAB Cluster */}
      <div className="fixed bottom-20 right-6 z-[490] flex flex-col items-center md:bottom-8 select-none">
        
        {/* Scroll To Top button (rendered above the FAB when scrolling) */}
        <AnimatePresence>
          {showScroll && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 15 }}
              onClick={scrollToTop}
              className="w-10 h-10 bg-velvet border border-gold/35 text-gold rounded-full flex items-center justify-center shadow-2xl hover:bg-gold hover:text-velvet hover:scale-110 mb-3.5 transition-all cursor-pointer"
              title="Scroll to Top"
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating Actions Sub-menu */}
        <div className="flex flex-col space-y-3.5 items-center mb-3.5">
          <AnimatePresence>
            {expanded && (
              <>
                {subButtons.map((btn, idx) => (
                  <motion.div
                    key={btn.id}
                    initial={{ opacity: 0, scale: 0.5, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 25 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="relative group flex items-center"
                  >
                    {/* Tooltip Label */}
                    <span className="absolute right-14 scale-0 group-hover:scale-100 bg-velvet border border-gold/25 text-gold text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl transition-all duration-300 origin-right">
                      {btn.label}
                    </span>

                    {/* Action Button */}
                    <button
                      onClick={btn.onClick}
                      className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer ${btn.color}`}
                    >
                      {btn.icon}
                    </button>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Master Gold Gradient FAB */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-12 h-12 bg-gradient-to-r from-gold-deep via-gold to-gold-rich text-velvet rounded-full flex items-center justify-center shadow-xl shadow-gold/15 transition-transform duration-500 cursor-pointer hover:opacity-90 ${
            expanded ? 'rotate-180 scale-105' : 'animate-pulse-gold'
          }`}
          title="Connect with Us"
        >
          {expanded ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>

      </div>
    </>
  );
};

export default FloatingButtons;
