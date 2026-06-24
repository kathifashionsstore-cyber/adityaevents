// src/components/common/LazyImage.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ src, alt, className, placeholder = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <img
      ref={ref}
      src={inView ? src : placeholder}
      alt={alt}
      className={`${className} transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-30'}`}
      loading="lazy"
    />
  );
};

export default LazyImage;
