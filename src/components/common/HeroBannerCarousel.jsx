import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useHeroBanners from '../../hooks/useHeroBanners';

const AUTOPLAY_DELAY = 5500;

const HeroBannerCarousel = ({
  pageKey,
  title,
  subtitle,
  children,
  variant = 'page',
  className = '',
  contentClassName = '',
}) => {
  const { slides } = useHeroBanners(pageKey, { activeOnly: true });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [pageKey]);

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const isHome = variant === 'home';
  const sizeClass = isHome ? 'h-screen min-h-[600px]' : 'min-h-[360px] md:min-h-[460px]';

  return (
    <section
      className={`relative w-full overflow-hidden bg-velvet ${sizeClass} ${className}`}
      aria-label={`${title || pageKey} hero banners`}
    >
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id || `${slide.imageUrl}-${index}`}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
            role="img"
            aria-label={slide.title || `${pageKey} banner ${index + 1}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-velvet via-velvet/80 to-transparent" />
        <div className="absolute inset-0 bg-velvet/25" />
      </div>

      <div
        className={`relative z-10 flex min-h-[inherit] w-full items-center justify-center px-6 text-center ${contentClassName}`}
      >
        {children || (
          <div className="mx-auto max-w-4xl py-16">
            <h1 className="font-display text-4xl font-extrabold leading-tight text-ivory sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-relaxed text-champagne/80 sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-velvet/50 text-gold backdrop-blur transition-colors hover:bg-velvet/80"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-velvet/50 text-gold backdrop-blur transition-colors hover:bg-velvet/80"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index ? 'w-8 bg-gold' : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
                aria-label={`Show banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBannerCarousel;
