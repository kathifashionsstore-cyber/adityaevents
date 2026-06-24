// src/components/common/MobileBottomNavigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, Calendar, Image, Phone } from 'lucide-react';

const MobileBottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/services', label: 'Services', icon: Sparkles },
    { path: '/booking', label: 'Book', icon: Calendar, isCenter: true },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/contact', label: 'Contact', icon: Phone }
  ];

  const isActive = (path) => currentPath === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-velvet/95 backdrop-blur-lg border-t border-gold/15 z-[400] shadow-2xl flex items-center justify-around px-2 pb-safe">
      {navItems.map((item, idx) => {
        const IconComponent = item.icon;
        
        if (item.isCenter) {
          return (
            <div key={idx} className="relative w-16 h-16 flex items-center justify-center">
              <Link
                to={item.path}
                className="absolute -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-gold-deep via-gold to-gold-rich text-velvet border-4 border-velvet shadow-xl shadow-gold/25 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Book an event"
              >
                <IconComponent className="w-5 h-5 mb-0.5 text-velvet stroke-[2.5]" />
                <span className="text-[8px] font-bold tracking-wider uppercase text-velvet leading-none">
                  Book
                </span>
              </Link>
            </div>
          );
        }

        const active = isActive(item.path);

        return (
          <Link
            key={idx}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center group cursor-pointer relative"
          >
            <div className={`p-1.5 rounded-lg transition-all duration-200 ${
              active 
                ? 'text-gold scale-110' 
                : 'text-champagne/60 group-hover:text-gold/80'
            }`}>
              <IconComponent className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className={`text-[9px] font-medium tracking-wide transition-colors duration-200 leading-none ${
              active 
                ? 'text-gold font-semibold' 
                : 'text-champagne/60 group-hover:text-gold/80'
            }`}>
              {item.label}
            </span>
            {active && (
              <span className="absolute bottom-1 w-1 h-1 bg-gold rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomNavigation;
