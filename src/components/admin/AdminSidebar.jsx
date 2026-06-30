// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { HERO_BANNER_PAGES } from '../../utils/heroBannerPages';
import { 
  LayoutDashboard, Calendar, Users, Settings, LogOut, Image, 
  HelpCircle, Shield, Bell, ImagePlus, Sparkles, Megaphone, Layers, Star, Briefcase
} from 'lucide-react';

const AdminSidebar = () => {
  const { adminProfile, logout } = useAuth();
  const { sidebarOpen, closeSidebar } = useAdmin();
  const location = useLocation();
  const isHeroBannersActive = location.pathname.startsWith('/admin/hero-banners');
  const activeHeroPage = new URLSearchParams(location.search).get('page') || 'home';

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/admin/bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
    { path: '/admin/leads', label: 'CRM Leads', icon: <Users className="w-4 h-4" /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const contentItems = [
    { path: '/admin/hero-banners', label: 'Hero Banners', icon: <ImagePlus className="w-4 h-4" /> },
    { path: '/admin/hero-slider', label: 'Home Hero Slider', icon: <Layers className="w-4 h-4" /> },
    { path: '/admin/gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
    { path: '/admin/services', label: 'Services Catalog', icon: <Briefcase className="w-4 h-4" /> },
    { path: '/admin/event-types', label: 'Event Customizer', icon: <Sparkles className="w-4 h-4" /> },
    { path: '/admin/google-reviews', label: 'Google Reviews', icon: <Star className="w-4 h-4" /> },
    { path: '/admin/faq', label: 'Manage FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { path: '/admin/marketing', label: 'Marketing Options', icon: <Megaphone className="w-4 h-4" /> },
  ];

  const adminName = adminProfile?.name || 'Administrator';
  const adminInitials = adminName.substring(0, 2).toUpperCase();

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="h-full flex flex-col justify-between p-6">
        
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/logo.webp" 
                alt="Logo" 
                className="h-12 w-12 rounded-full border border-gold/30 object-cover" 
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-gold text-lg tracking-wide leading-none">Adithya</span>
                <span className="font-body text-champagne text-[9px] uppercase tracking-[2px] leading-tight mt-0.5">Admin Console</span>
              </div>
            </Link>
          </div>

          {/* Profile overview */}
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/5">
            <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-display font-bold text-xs shrink-0">
              {adminInitials}
            </div>
            <div className="min-w-0">
              <p className="font-body text-xs font-bold text-champagne truncate">{adminName}</p>
              <span className="font-mono text-[9px] text-gold/80 flex items-center mt-0.5">
                <Shield className="w-3 h-3 mr-1" />
                {adminProfile?.role?.toUpperCase() || 'ADMIN'}
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col space-y-1 font-body text-xs">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => `flex items-center space-x-3 px-4.5 py-3 rounded-lg border transition-all duration-300 ${
                  isActive 
                    ? 'bg-gold/10 border-gold/30 text-gold font-semibold' 
                    : 'bg-transparent border-transparent text-champagne/70 hover:text-gold hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="pt-5">
              <p className="px-4 pb-2 font-body text-[9px] font-bold uppercase tracking-[2px] text-gold/60">
                Content Management
              </p>
              <div className="flex flex-col space-y-1">
                {contentItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) => `flex items-center space-x-3 px-4.5 py-3 rounded-lg border transition-all duration-300 ${
                      isActive 
                        ? 'bg-gold/10 border-gold/30 text-gold font-semibold' 
                        : 'bg-transparent border-transparent text-champagne/70 hover:text-gold hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>

              {isHeroBannersActive && (
                <div className="ml-5 mt-2 space-y-1 border-l border-gold/15 pl-3">
                  {HERO_BANNER_PAGES.map((page) => (
                    <Link
                      key={page.key}
                      to={`/admin/hero-banners?page=${page.key}`}
                      onClick={closeSidebar}
                      className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${
                        activeHeroPage === page.key
                          ? 'bg-gold/10 text-gold'
                          : 'text-champagne/55 hover:bg-white/5 hover:text-gold'
                      }`}
                    >
                      {page.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Footer Logout */}
        <button
          onClick={logout}
          className="flex items-center justify-center space-x-3 w-full py-3 border border-white/10 text-champagne/70 hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all text-xs uppercase font-medium rounded-lg cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

      </div>
    </aside>
  );
};

export default AdminSidebar;
