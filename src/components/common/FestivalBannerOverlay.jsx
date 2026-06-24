// src/components/common/FestivalBannerOverlay.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_FESTIVAL_CONFIG = {
  active: false,
  title: 'Happy Vijayadashami!',
  greeting: 'Wishing you and your family a festive season filled with joy, prosperity, and beautiful celebrations. May all your event dreams come true.',
  imageUrl: 'https://images.unsplash.com/photo-1608976451613-2d2745195b0c?q=80&w=1200', // Premium marigold/diya visual
  startDate: '2026-10-15',
  endDate: '2026-10-25',
  showCredits: true
};

const FestivalBannerOverlay = () => {
  const [config, setConfig] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. If already shown in session, skip loading
    const shown = sessionStorage.getItem('festival_shown');
    if (shown) return;

    // 2. Fetch config from Firestore
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'festival');
        const docSnap = await getDoc(docRef);
        let data = DEFAULT_FESTIVAL_CONFIG;
        
        if (docSnap.exists()) {
          data = { ...DEFAULT_FESTIVAL_CONFIG, ...docSnap.data() };
        }
        
        setConfig(data);

        // 3. Verify date activation checks and active toggle
        if (data.active) {
          const today = new Date().toISOString().split('T')[0];
          const start = data.startDate;
          const end = data.endDate;

          if (today >= start && today <= end) {
            // Show overlay
            setVisible(true);
          }
        }
      } catch (err) {
        console.error('Error fetching festival config:', err);
      }
    };

    fetchConfig();
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('festival_shown', 'true');
    setVisible(false);
  };

  if (!visible || !config) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-velvet/95 backdrop-blur-md"
        >
          {/* Overlay Box */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative w-full max-w-xl bg-amethyst border-2 border-gold/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Backdrop Image */}
            <div className="h-48 sm:h-64 w-full relative">
              <img 
                src={config.imageUrl} 
                alt="Festival decoration" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amethyst via-amethyst/30 to-transparent" />
              
              {/* Close Button overlay */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-velvet/85 text-gold hover:text-cream rounded-full border border-gold/30 hover:bg-velvet transition-colors cursor-pointer"
                aria-label="Close Overlay"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Greetings Details */}
            <div className="p-6 sm:p-8 text-center space-y-4 flex-1">
              <div className="flex justify-center text-gold">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-cream uppercase tracking-wide">
                {config.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-champagne/80 leading-relaxed max-w-md mx-auto">
                {config.greeting}
              </p>
              
              {/* Call-to-action */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 bg-gradient-to-r from-gold-deep via-gold to-gold-rich hover:opacity-90 text-velvet font-body font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-gold/25"
                >
                  Enter Site
                </button>
              </div>
            </div>

            {/* Bottom Credits footer */}
            {config.showCredits && (
              <div className="bg-velvet/80 py-3 text-center border-t border-white/5">
                <span className="font-body text-[9px] tracking-wider text-champagne/45 uppercase">
                  Adithya Event Management &copy; 2026 | Powered by WayzenTech 9398724704
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FestivalBannerOverlay;
