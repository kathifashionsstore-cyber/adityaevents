// src/pages/public/PackagesPage.jsx
import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import useAnalytics from '../../hooks/useAnalytics';
import { PACKAGES } from '../../utils/constants';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import Card from '../../components/common/Card';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PackagesPage = () => {
  useAnalytics('packages');
  const scrollRef = useScrollAnimation();

  return (
    <PageTransition>
      <SEOHead pageKey="packages" />
      <div className="py-20 px-6 max-w-5xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-primary mb-2">Event Packages</h1>
          <p className="font-body text-xs sm:text-sm text-gold tracking-widest uppercase">Royal setups at bespoke themes</p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PACKAGES.map((pkg) => (
            <Card key={pkg.id} className="p-6 flex flex-col justify-between text-left" hoverEffect>
              <div className="space-y-4">
                <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-white/5 border border-white/10 text-gold">
                  {pkg.category}
                </span>
                <h3 className="font-display text-lg font-bold text-champagne">{pkg.name}</h3>
                
                <ul className="space-y-2.5 pt-4">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="font-body text-xs text-champagne/80 flex items-start">
                      <Check className="w-4 h-4 text-gold mr-2 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  to="/booking"
                  className="w-full btn-premium btn-gold py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1"
                >
                  <span>Select Package</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Quote Notice */}
        <div ref={scrollRef} className="reveal-on-scroll bg-white/5 border border-white/5 p-6 rounded-xl text-center">
          <p className="font-body text-xs text-champagne/70 leading-relaxed">
            * All packages are fully customizable. Stage backdrop designs can be scaled and tailored to your venue size. Contact our coordinators to get a custom design quotation.
          </p>
        </div>

      </div>
    </PageTransition>
  );
};

export default PackagesPage;
