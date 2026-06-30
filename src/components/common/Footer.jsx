// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { BUSINESS_DETAILS } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darkSection text-white/80 pt-16 pb-8 border-t border-primaryRose/15 relative z-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Details */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.webp" 
              alt="Adithya Event Management" 
              className="h-14 w-14 rounded-full border border-primaryRose/30 object-cover" 
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-primaryRose text-xl tracking-wide leading-none">Adithya</span>
              <span className="font-body text-white/90 text-[10px] uppercase tracking-[2px] leading-tight font-semibold mt-0.5">Event Management</span>
            </div>
          </Link>
          <p className="font-body text-xs text-white/70 leading-relaxed">
            Crafting premium celebrations, exquisite decors, and traditional gourmet feasts across Vijayawada and Krishna District since 2015.
          </p>
          <div className="flex space-x-3 pt-2">
            <a
              href="https://instagram.com/adithya_event_management"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-primaryRose/40 hover:border-primaryRose bg-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all p-1"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-primaryRose/40 hover:border-primaryRose bg-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all p-1"
            >
              <Facebook className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-primaryRose text-xs font-bold tracking-widest uppercase mb-5">
            Quick Navigation
          </h4>
          <ul className="space-y-3 font-body text-xs text-white/75">
            <li><Link to="/about" className="hover:text-secondaryRoseGold transition-colors">About History</Link></li>
            <li><Link to="/services" className="hover:text-secondaryRoseGold transition-colors">Services Tiers</Link></li>
            <li><Link to="/packages" className="hover:text-secondaryRoseGold transition-colors">Theme Packages</Link></li>
            <li><Link to="/gallery" className="hover:text-secondaryRoseGold transition-colors">Real Event Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-secondaryRoseGold transition-colors">Plan Your Event</Link></li>
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="font-display text-primaryRose text-xs font-bold tracking-widest uppercase mb-5">
            Our Services
          </h4>
          <ul className="space-y-3 font-body text-xs text-white/75">
            <li><Link to="/services/wedding" className="hover:text-secondaryRoseGold transition-colors">Royal Weddings</Link></li>
            <li><Link to="/services/catering" className="hover:text-secondaryRoseGold transition-colors">Gourmet Catering</Link></li>
            <li><Link to="/services/birthday" className="hover:text-secondaryRoseGold transition-colors">Theme Birthdays</Link></li>
            <li><Link to="/services/corporate" className="hover:text-secondaryRoseGold transition-colors">Corporate Events</Link></li>
            <li><Link to="/services/engagement" className="hover:text-secondaryRoseGold transition-colors">Engagement Setups</Link></li>
          </ul>
        </div>

        {/* Contact Block */}
        <div>
          <h4 className="font-display text-primaryRose text-xs font-bold tracking-widest uppercase mb-5">
            Business Office
          </h4>
          <ul className="space-y-4 font-body text-xs text-white/75">
            <li className="flex items-start">
              <MapPin className="w-4 h-4 text-primaryRose mr-3 shrink-0 mt-0.5" />
              <span>{BUSINESS_DETAILS.address}</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 text-primaryRose mr-3 shrink-0" />
              <a href={`tel:${BUSINESS_DETAILS.phone}`} className="hover:text-secondaryRoseGold transition-colors">
                +91 93932 17676
              </a>
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 text-primaryRose mr-3 shrink-0" />
              <a href={`mailto:${BUSINESS_DETAILS.email}`} className="hover:text-secondaryRoseGold transition-colors">
                {BUSINESS_DETAILS.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Underline and Credits */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/50 font-body">
        <p>© {currentYear} Adithya Event Management. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-secondaryRoseGold transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-secondaryRoseGold transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
