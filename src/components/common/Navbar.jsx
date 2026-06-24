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
      className={`fixed top-0 left-0 w-full h-[80px] z-[500] transition-all duration-300 px-6 lg:px-16 flex items-center justify-between ${
        scrolled 
          ? 'bg-velvet/95 backdrop-blur-md shadow-lg border-b border-gold/15' 
          : 'bg-transparent'
      }`}
    >
      {/* Brand Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <img 
          src="/logo.webp" 
          alt="Adithya Event Management Logo" 
          className="h-12 w-12 rounded-full border border-gold/30 object-cover"
        />
        <div className="flex flex-col">
          <span className="font-display font-bold text-gold text-lg lg:text-xl tracking-wide leading-none">
            Adithya Events
          </span>
          <span className="font-body text-champagne text-[9px] uppercase tracking-[2px] leading-tight opacity-85 mt-0.5">
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
            className={`font-body text-sm font-medium tracking-wide transition-colors duration-300 relative py-2 ${
              isActive(link.path) ? 'text-gold' : 'text-champagne hover:text-gold'
            }`}
          >
            {link.label}
            {isActive(link.path) && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-full" />
            )}
          </Link>
        ))}

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center text-rose-gold hover:text-gold font-body text-sm font-medium"
          >
            <Shield className="w-4 h-4 mr-1 text-gold" />
            Admin
          </Link>
        )}
      </div>

      {/* Control Widgets */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        <ThemeToggle />

        {/* Notifications Bell */}
        {currentUser && (
          <Link to={isAdmin ? "/admin/notifications" : "/track-booking"} className="relative text-champagne hover:text-gold transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-burgundy border border-gold/30 text-gold font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        <Link
          to="/booking"
          className="hidden sm:inline-flex btn-premium btn-gold text-xs tracking-wider uppercase px-5 py-2.5"
        >
          Book Now
        </Link>

        {/* Mobile Hamburguer */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-champagne hover:text-gold transition-colors p-1"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
