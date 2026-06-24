// src/components/common/PWAInstallBanner.jsx
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Delay showing the banner by 10 seconds (as per specification)
      const timer = setTimeout(() => {
        // Only show if the user hasn't dismissed it this session
        const dismissed = sessionStorage.getItem('pwa_dismissed');
        if (!dismissed) {
          setShowBanner(true);
        }
      }, 10000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_dismissed', 'true');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-velvet/95 backdrop-blur-md border border-gold/30 rounded-xl p-4 shadow-2xl z-50 flex items-start space-x-4"
        >
          <div className="p-2.5 bg-gold/10 rounded-lg text-gold border border-gold/20 flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          
          <div className="flex-1 text-left">
            <h4 className="font-display text-sm font-semibold text-gold leading-tight">
              Install Adithya Events
            </h4>
            <p className="font-body text-xs text-champagne/80 mt-1 leading-normal">
              Add our app to your home screen for quick bookings, offline access, and real-time updates.
            </p>
            <div className="flex items-center space-x-3 mt-3">
              <button
                type="button"
                onClick={handleInstall}
                className="px-4 py-1.5 bg-gold hover:bg-gold/90 text-velvet font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-lg shadow-gold/25"
              >
                Install App
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs text-champagne/50 hover:text-champagne transition-colors cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-champagne/50 hover:text-champagne p-1 transition-colors rounded-full hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
