// src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';

/**
 * Custom hook applying entry transition styles when DOM item scrolls into view
 * @returns {React.RefObject} ref to bind
 */
export const useScrollAnimation = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Animate once
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return elementRef;
};

export default useScrollAnimation;
