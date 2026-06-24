// src/pages/public/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import Button from '../../components/common/Button';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <PageTransition>
      <SEOHead pageKey="home" />
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <AlertTriangle className="w-16 h-16 text-gold mb-6 animate-bounce" />
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-ivory mb-3">404 - Not Found</h1>
        <p className="font-body text-xs sm:text-sm text-champagne/70 max-w-md leading-relaxed mb-8">
          Sorry! The page you are looking for does not exist or has been moved. Verify the destination URL.
        </p>
        <Link to="/">
          <Button className="px-8 py-3 text-xs uppercase font-bold tracking-widest">
            Return to Home
          </Button>
        </Link>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
