// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './AppRoutes';
import LoadingScreen from './components/common/LoadingScreen';
import Navbar from './components/common/Navbar';
import MobileNavbar from './components/common/MobileNavbar';
import Footer from './components/common/Footer';
import FloatingButtons from './components/common/FloatingButtons';
import { Toaster } from 'react-hot-toast';
import AIChatbot from './components/chat/AIChatbot';
import AnnouncementBar from './components/common/AnnouncementBar';
import MobileBottomNavigation from './components/common/MobileBottomNavigation';
import PWAInstallButton from './components/common/PWAInstallButton';
import FestivalBannerOverlay from './components/common/FestivalBannerOverlay';
import './styles/globals.css';

// A wrapper to selectively hide Navbar, Footer, and Chatbot on admin routes
const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(() => {
    return !sessionStorage.getItem('announcement_dismissed');
  });

  useEffect(() => {
    const handleClose = () => {
      setAnnouncementVisible(false);
    };
    window.addEventListener('announcement_closed', handleClose);
    return () => window.removeEventListener('announcement_closed', handleClose);
  }, []);

  return (
    <>
      {!isAdminRoute && announcementVisible && (
        <AnnouncementBar />
      )}
      {!isAdminRoute && (
        <Navbar 
          onMenuToggle={() => setMobileMenuOpen(true)} 
          style={{ top: announcementVisible ? '40px' : '0px' }}
        />
      )}
      {!isAdminRoute && (
        <MobileNavbar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      )}
      
      <main className={!isAdminRoute ? (announcementVisible ? "pt-[120px]" : "pt-[80px]") : ""}>
        <AppRoutes />
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileBottomNavigation />}
      {!isAdminRoute && <FloatingButtons />}
      {!isAdminRoute && <AIChatbot />}
      {!isAdminRoute && <PWAInstallButton />}
      {!isAdminRoute && <FestivalBannerOverlay />}
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <BrowserRouter>
                {loading ? (
                  <LoadingScreen onComplete={() => setLoading(false)} />
                ) : (
                  <LayoutWrapper />
                )}
                <Toaster position="top-right" reverseOrder={false} />
              </BrowserRouter>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
