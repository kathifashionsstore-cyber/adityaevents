// src/components/common/FloatingButtons.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, ChevronUp } from 'lucide-react';

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerChatbot = () => {
    window.dispatchEvent(new CustomEvent('toggle-chatbot'));
  };

  // Official WhatsApp SVG icon
  const WhatsAppIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.486.002 9.965-4.47 9.969-9.948.002-2.654-1.03-5.15-2.906-7.028-1.878-1.878-4.377-2.91-7.037-2.913-5.499 0-9.978 4.475-9.982 9.953-.002 2.035.533 4.022 1.547 5.765L1.13 21.077l4.58-1.2c1.65.9 3.23 1.277 4.7 1.277h.003zM17.47 14.397c-.3-.149-1.777-.878-2.031-.971-.253-.093-.438-.14-.62.149-.182.289-.707.878-.867 1.058-.16.18-.32.2-.62.051-.3-.149-1.264-.467-2.409-1.488-.89-.793-1.49-1.77-1.665-2.07-.175-.3-.019-.461.13-.609.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.62-1.492-.85-2.046-.224-.539-.452-.465-.62-.474-.16-.007-.343-.009-.528-.009-.185 0-.485.07-.74.349-.253.28-1.026 1.002-1.026 2.443 0 1.44 1.049 2.832 1.197 3.029.15.197 2.065 3.152 5.003 4.429.7.304 1.246.486 1.672.622.705.224 1.346.193 1.854.117.564-.085 1.777-.726 2.027-1.427.25-.701.25-1.3.175-1.427-.075-.127-.275-.2-.575-.349z"/>
    </svg>
  );

  // Spacing offsets for mobile BottomNav/iOS Safe Areas
  const mobileBottomOffset = 'calc(96px + env(safe-area-inset-bottom))';
  const desktopBottomOffset = '32px';

  const positionStyle = {
    bottom: isMobile ? mobileBottomOffset : desktopBottomOffset
  };

  return (
    <>
      {/* 1. BOTTOM LEFT: Social Brand Stack with Float Animation */}
      <motion.div 
        style={positionStyle}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="fixed left-6 z-[490] flex flex-col space-y-3.5 items-center select-none"
      >
        {/* Instagram */}
        <a
          href="https://instagram.com/adithya_event_management"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeB 90%)' }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg cursor-pointer"
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
          style={{ backgroundColor: '#1877F2' }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg cursor-pointer"
          title="Follow us on Facebook"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
        </a>
      </motion.div>

      {/* 2. BOTTOM RIGHT: Vertical Stack (Scroll-to-top, WhatsApp, Call, Chatbot) */}
      <div 
        style={positionStyle}
        className="fixed right-6 z-[490] flex flex-col space-y-3 items-center select-none"
      >
        {/* Scroll To Top */}
        <AnimatePresence>
          {showScroll && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 15 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-darkSection border border-border-soft text-accentGold rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
              title="Scroll to Top"
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Chat */}
        <button
          onClick={() => {
            const welcomeMessage = "Hello Adithya Event Management! I am interested in inquiring about event decor and catering packages.";
            window.open(`https://wa.me/919393217676?text=${encodeURIComponent(welcomeMessage)}`, '_blank');
          }}
          style={{ backgroundColor: '#25D366' }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
          title="WhatsApp Chat"
        >
          <WhatsAppIcon />
        </button>

        {/* Call Coordinator */}
        <button
          onClick={() => window.open('tel:+919393217676', '_self')}
          style={{ backgroundColor: '#22C55E' }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
          title="Call Coordinator"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* AI Chatbot Assistant */}
        <button
          onClick={triggerChatbot}
          className="w-12 h-12 rounded-full bg-primaryRose border border-border-soft text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
          title="AI Assistant"
        >
          <MessageSquare className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </>
  );
};

export default FloatingButtons;
