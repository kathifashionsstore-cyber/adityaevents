// src/hooks/useAnalytics.js
import { useEffect } from 'react';
import { logPageView } from '../services/analyticsService';

export const useAnalytics = (pageName) => {
  useEffect(() => {
    logPageView(pageName);
  }, [pageName]);
};

export default useAnalytics;
