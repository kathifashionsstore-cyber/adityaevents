// src/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import PackagesPage from './pages/public/PackagesPage';
import GalleryPage from './pages/public/GalleryPage';
import EventDetailPage from './pages/public/EventDetailPage';
import ContactPage from './pages/public/ContactPage';
import BookingPage from './pages/public/BookingPage';
import TrackBookingPage from './pages/public/TrackBookingPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminFAQPage from './pages/admin/AdminFAQPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminHeroBannersPage from './pages/admin/AdminHeroBannersPage';
import AdminMarketingPage from './pages/admin/AdminMarketingPage';
import AdminEventTypesPage from './pages/admin/AdminEventTypesPage';
import AdminHeroSliderPage from './pages/admin/AdminHeroSliderPage';
import AdminGoogleReviewsPage from './pages/admin/AdminGoogleReviewsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/events/:slug" element={<EventDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/track-booking" element={<TrackBookingPage />} />

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Console Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="hero-slider" element={<AdminHeroSliderPage />} />
        <Route path="google-reviews" element={<AdminGoogleReviewsPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="hero-banners" element={<AdminHeroBannersPage />} />
        <Route path="marketing" element={<AdminMarketingPage />} />
        <Route path="event-types" element={<AdminEventTypesPage />} />
        <Route path="faq" element={<AdminFAQPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
