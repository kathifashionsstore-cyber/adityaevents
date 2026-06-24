// src/components/common/MobileNavbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, LogOut } from 'lucide-react';

const MobileNavbar = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/packages', label: 'Packages' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ];

  const sidebarVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop click block */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-sm"
          />

          {/* Drawer body */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-full w-[280px] bg-charcoal z-[999] shadow-2xl border-l border-gold/10 p-6 flex flex-col justify-between"
          >
            <div>
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="font-accent text-gold text-xl tracking-wider leading-none">Adithya</span>
                  <span className="font-body text-champagne text-[9px] uppercase tracking-[2px] leading-tight">Events</span>
                </div>
                <button onClick={onClose} className="text-champagne hover:text-gold p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="flex flex-col space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`font-body text-base font-medium tracking-wide py-2 border-b border-white/5 transition-colors ${
                      location.pathname === link.path ? 'text-gold' : 'text-champagne/90 hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center text-rose-gold hover:text-gold font-body text-base font-medium py-2 border-b border-white/5"
                  >
                    <Shield className="w-4 h-4 mr-2 text-gold" />
                    Admin Portal
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col space-y-4">
              <Link
                to="/booking"
                onClick={handleLinkClick}
                className="w-full btn-premium btn-gold text-center py-3 uppercase tracking-widest text-xs font-bold shadow-lg shadow-gold/10"
              >
                Book Your Event
              </Link>
              
              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-white/10 text-champagne/70 hover:text-gold transition-colors text-xs uppercase font-medium rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavbar;
