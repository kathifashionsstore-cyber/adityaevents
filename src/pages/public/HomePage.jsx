// src/pages/public/HomePage.jsx
import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import HeroSection from '../../components/home/HeroSection';
import EventsCircleSection from '../../components/home/EventsCircleSection';
import PackageCircles from '../../components/home/PackageCircles';
import ServicesSection from '../../components/home/ServicesSection';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import GallerySection from '../../components/home/GallerySection';
import DarkFeatureBand from '../../components/common/DarkFeatureBand';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import GoogleReviewsSection from '../../components/home/GoogleReviewsSection';
import FAQSection from '../../components/home/FAQSection';
import ContactSection from '../../components/home/ContactSection';
import BrochureDownload from '../../components/home/BrochureDownload';
import PreFooterCTA from '../../components/home/PreFooterCTA';
import useAnalytics from '../../hooks/useAnalytics';

const HomePage = () => {
  useAnalytics('home');

  return (
    <PageTransition>
      <SEOHead pageKey="home" />
      <HeroSection />
      <EventsCircleSection />
      <PackageCircles />
      <ServicesSection />
      <WhyChooseUs />
      <GallerySection />
      <DarkFeatureBand />
      <TestimonialsSection />
      <GoogleReviewsSection />
      <FAQSection />
      <ContactSection />
      <BrochureDownload />
      <PreFooterCTA />
    </PageTransition>
  );
};

export default HomePage;
