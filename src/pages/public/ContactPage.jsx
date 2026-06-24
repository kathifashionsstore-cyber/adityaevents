// src/pages/public/ContactPage.jsx
import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import HeroBannerCarousel from '../../components/common/HeroBannerCarousel';
import useAnalytics from '../../hooks/useAnalytics';
import ContactSection from '../../components/home/ContactSection';

const ContactPage = () => {
  useAnalytics('contact');

  return (
    <PageTransition>
      <SEOHead pageKey="contact" />
      <HeroBannerCarousel
        pageKey="contact"
        title="Contact"
        subtitle="Call, WhatsApp, or send an inquiry to plan your next event."
      />
      <div className="py-10">
        <ContactSection />
        
        {/* Google Map Embed for Vuyyuru */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="rounded-2xl overflow-hidden border border-gold/10 aspect-[21/9] min-h-[300px] shadow-2xl relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.4665471649774!2d80.85233261536718!3d16.370535988689537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a360662d5555555%3A0x6b44cc4a4b4b4b4b!2sVuyyuru%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Adithya Event Management office location map"
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ContactPage;
