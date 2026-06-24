// src/components/admin/AdminTopbar.jsx
import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNotifications } from '../../context/NotificationContext';
import { Menu, Bell, Search, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTopbar = ({ title = 'Dashboard' }) => {
  const { toggleSidebar, searchQuery, setSearchQuery } = useAdmin();
  const { unreadCount } = useNotifications();

  return (
    <header className="h-[70px] border-b border-gold/10 bg-charcoal/20 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-[90]">
      <div className="flex items-center space-x-4">
        {/* Mobile Hamburger menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-champagne hover:text-gold p-1 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-display text-base sm:text-lg font-bold text-gold uppercase tracking-wider shrink-0">
          {title}
        </h2>
      </div>

      {/* Admin actions block */}
      <div className="flex items-center space-x-6">
        {/* Search bar */}
        <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 w-60">
          <Search className="w-4 h-4 text-champagne/40 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking logs..."
            className="bg-transparent border-none text-xs text-champagne focus:outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <Link to="/admin/notifications" className="relative text-champagne hover:text-gold transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-burgundy border border-gold/30 text-gold font-mono text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Admin stamp */}
        <div className="flex items-center space-x-1.5 text-xs text-champagne/60 bg-white/5 px-2.5 py-1 rounded border border-white/5">
          <Shield className="w-3.5 h-3.5 text-gold" />
          <span className="font-mono text-[10px]">CONSOLE</span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
