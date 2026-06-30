// src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from './ThemeToggle';
import { Bell, Menu, X, Shield } from 'lucide-react';

const Navbar = ({ onMenuToggle, style }) => {
  const { isDark } = useTheme();
  const { currentUser, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/packages', label: 'Packages' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={style}
      className={`fixed top-0 left-0 w-full h-[80px] z-[500] transition-all duration-300 px-6 lg:px-16 flex items-center justify-between bg-surface border-b border-primaryRose/15 ${
        scrolled 
          ? 'shadow-md bg-surface/95 backdrop-blur-md' 
          : 'shadow-sm'
      }`}
    >
      {/* Brand Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <img 
          src="/logo.webp" 
          alt="Adithya Event Management Logo" 
          className="h-12 w-12 rounded-full border border-primaryRose/30 object-cover"
        />
        <div className="flex flex-col">
          <span className="font-display font-bold text-textPrimary text-lg lg:text-xl tracking-wide leading-none">
            Adithya Events
          </span>
          <span className="font-body text-primaryRose text-[9px] uppercase tracking-[2px] leading-tight font-semibold mt-0.5">
            Royal Celebrations
          </span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`font-body text-xs font-bold uppercase tracking-widest transition-colors duration-300 relative py-2 ${
              isActive(link.path) ? 'text-primaryRose' : 'text-textPrimary hover:text-primaryRose'
            }`}
          >
            {link.label}
            {isActive(link.path) && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primaryRose rounded-full" />
            )}
          </Link>
        ))}

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center text-primaryRose hover:text-secondaryRoseGold font-body text-xs font-bold uppercase tracking-widest"
          >
            <Shield className="w-4 h-4 mr-1 text-primaryRose" />
            Admin
          </Link>
        )}
      </div>

      {/* Control Widgets */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        <ThemeToggle />

        {/* Notifications Bell */}
        {currentUser && (
          <Link to={isAdmin ? "/admin/notifications" : "/track-booking"} className="relative text-textPrimary hover:text-primaryRose transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primaryRose border border-white text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        <Link
          to="/booking"
          className="hidden sm:inline-flex btn-premium btn-gold text-[10px] tracking-widest uppercase px-6 py-3"
        >
          Book Now
        </Link>

        {/* Mobile Hamburguer */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-textPrimary hover:text-primaryRose transition-colors p-1"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
