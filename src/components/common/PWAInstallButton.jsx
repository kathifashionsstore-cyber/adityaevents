// src/components/common/PWAInstallButton.jsx
import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPill, setShowPill] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 1. Detect if iOS
    const userAgent = window.navigator.userAgent || '';
    const iosDetect = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIOS(iosDetect);

    // 2. Check if already standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isStandalone) return;

    // 3. For Android/Chrome: listen to native install trigger event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPill(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. For iOS: show the pill if iOS Safari and not standalone
    if (iosDetect && !isStandalone) {
      // Delay showing on load
      const timer = setTimeout(() => {
        const dismissed = sessionStorage.getItem('pwa_ios_dismissed');
        if (!dismissed) {
          setShowPill(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA Installation outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowPill(false);
  };

  const handleDismissPill = (e) => {
    e.stopPropagation();
    if (isIOS) {
      sessionStorage.setItem('pwa_ios_dismissed', 'true');
    }
    setShowPill(false);
  };

  return (
    <>
      {/* Floating Installation Pill */}
      <AnimatePresence>
        {showPill && (
          <motion.div
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.9 }}
            className="fixed top-[88px] right-6 z-[480] md:bottom-6 md:left-6 md:top-auto md:right-auto md:translate-x-0 select-none max-md:left-auto max-md:translate-x-0"
          >
            <div
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-gold-deep via-gold to-gold-rich text-velvet font-body font-bold text-[10px] md:text-xs uppercase tracking-widest px-3 py-2 md:px-5 md:py-3 rounded-full flex items-center space-x-1.5 md:space-x-2.5 shadow-xl shadow-gold/25 cursor-pointer hover:scale-105 transition-transform"
            >
              <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-velvet animate-bounce" />
              <span>{isMobile ? 'Install' : 'Install Web App'}</span>
              <button
                onClick={handleDismissPill}
                className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-velvet/15 flex items-center justify-center text-velvet hover:bg-velvet/30 cursor-pointer ml-1"
                aria-label="Close"
              >
                <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Step-by-Step Installation Overlay */}
      <AnimatePresence>
        {showIosModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-velvet/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card-dark border border-gold/30 rounded-2xl max-w-sm w-full p-6 text-champagne relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowIosModal(false)}
                className="absolute top-4 right-4 text-champagne/45 hover:text-gold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/35 flex items-center justify-center mx-auto text-gold">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-base text-gold">
                  Install on Apple iOS
                </h4>
                <p className="font-body text-xs text-champagne/60">
                  Follow these simple steps to add Adithya Events to your home screen:
                </p>
              </div>

              {/* Instructions Steps */}
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3.5 border-b border-white/5 pb-3">
                  <span className="w-6 h-6 rounded-full bg-gold text-velvet flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  <div className="space-y-1">
                    <p className="font-body text-xs font-semibold text-cream">
                      Open Safari Share Menu
                    </p>
                    <p className="font-body text-[11px] text-champagne/70 flex items-center">
                      Tap the <Share className="w-3.5 h-3.5 mx-1.5 text-gold" /> icon in your bottom toolbar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <span className="w-6 h-6 rounded-full bg-gold text-velvet flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  <div className="space-y-1">
                    <p className="font-body text-xs font-semibold text-cream">
                      Add to Home Screen
                    </p>
                    <p className="font-body text-[11px] text-champagne/70 flex items-center">
                      Scroll down and tap <PlusSquare className="w-3.5 h-3.5 mx-1.5 text-gold" /> 'Add to Home Screen'.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom confirmation */}
              <button
                onClick={() => {
                  setShowIosModal(false);
                  setShowPill(false);
                }}
                className="w-full mt-6 py-2.5 bg-gold hover:bg-gold/90 text-velvet font-body font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-lg shadow-gold/25"
              >
                Okay, Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallButton;
