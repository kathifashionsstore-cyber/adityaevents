// src/pages/public/TrackBookingPage.jsx
import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import BookingTracker from '../../components/booking/BookingTracker';
import useAnalytics from '../../hooks/useAnalytics';

const TrackBookingPage = () => {
  useAnalytics('track-booking');

  return (
    <PageTransition>
      <SEOHead pageKey="home" />
      <div className="py-20 px-6 max-w-5xl mx-auto min-h-[85vh]">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-primary mb-2">Track Your Event</h1>
          <p className="font-body text-xs sm:text-sm text-gold tracking-widest uppercase">Check slot confirmations and payment logs</p>
        </div>
        <BookingTracker />
      </div>
    </PageTransition>
  );
};

export default TrackBookingPage;
