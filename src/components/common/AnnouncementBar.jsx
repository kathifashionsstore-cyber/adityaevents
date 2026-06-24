// src/components/common/AnnouncementBar.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { X, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_ANNOUNCEMENTS = [
  "✨ Book your Royal Wedding slots now! Special custom decors available for Vuyyuru & surrounding areas.",
  "🍲 Treat your guests to our premium Live Buffet Catering spreads.",
  "⚡ High-energy intelligent lighting, LED backdrop wall, and line-array DJ sounds now live!"
];

const AnnouncementBar = () => {
  const [items, setItems] = useState(DEFAULT_ANNOUNCEMENTS);
  const [speed, setSpeed] = useState(4000); // 4 seconds cycle default
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. Check session storage to see if user dismissed it
    const closed = sessionStorage.getItem('announcement_dismissed');
    if (!closed) {
      setVisible(true);
    }

    // 2. Fetch announcements config from Firestore
    const fetchAnnouncements = async () => {
      try {
        const docRef = doc(db, 'settings', 'announcements');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.items && data.items.length > 0) {
            setItems(data.items);
          }
          if (data.speed) {
            setSpeed(data.speed);
          }
        }
      } catch (err) {
        console.error('Error loading announcements:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  // 3. Cycle announcements
  useEffect(() => {
    if (!visible || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, speed);
    return () => clearInterval(interval);
  }, [items, speed, visible]);

  const handleDismiss = () => {
    sessionStorage.setItem('announcement_dismissed', 'true');
    setVisible(false);
    window.dispatchEvent(new Event('announcement_closed'));
  };

  if (!visible || items.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-rich text-velvet h-10 w-full flex items-center justify-between px-4 z-[600] relative border-b border-gold-rich/20">
      
      {/* Spacer for alignment */}
      <div className="w-6 h-6 hidden sm:block" />

      {/* Rotating content */}
      <div className="flex-1 flex items-center justify-center space-x-2 overflow-hidden h-full">
        <Megaphone className="w-4 h-4 text-velvet shrink-0 animate-bounce" />
        
        <div className="relative h-6 w-full max-w-lg md:max-w-2xl overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-body text-[10px] sm:text-xs font-bold tracking-wide truncate text-center w-full"
            >
              {items[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="text-velvet hover:bg-black/10 p-1 rounded-full transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss Announcement"
      >
        <X className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

    </div>
  );
};

export default AnnouncementBar;
