import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import HeroBannerCarousel from '../../components/common/HeroBannerCarousel';
import useAnalytics from '../../hooks/useAnalytics';

const ManagedHeroPage = ({ pageKey, title, subtitle }) => {
  useAnalytics(pageKey);

  return (
    <PageTransition>
      <SEOHead pageKey={pageKey} />
      <HeroBannerCarousel pageKey={pageKey} title={title} subtitle={subtitle} />
      <section className="mx-auto max-w-5xl px-6 py-14 text-center">
        <h2 className="font-display text-2xl font-bold text-champagne">{title}</h2>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-relaxed text-champagne/70">
            {subtitle}
          </p>
        )}
      </section>
    </PageTransition>
  );
};

export default ManagedHeroPage;
