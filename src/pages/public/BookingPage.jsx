// src/pages/public/BookingPage.jsx
import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import BookingForm from '../../components/booking/BookingForm';
import useAnalytics from '../../hooks/useAnalytics';

const BookingPage = () => {
  useAnalytics('booking');

  return (
    <PageTransition>
      <SEOHead pageKey="packages" />
      <div className="py-12 bg-charcoal/20 min-h-[80vh]">
        <BookingForm />
      </div>
    </PageTransition>
  );
};

export default BookingPage;
