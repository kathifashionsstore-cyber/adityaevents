// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeActiveTheme, hexToRgbaStr, THEME_PRESETS } from '../services/themeService';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  const [activeThemeData, setActiveThemeData] = useState(null);
  const [loadingTheme, setLoadingTheme] = useState(true);

  // Apply active colors to DOM root custom variables
  const applyThemeToDom = (themeData) => {
    if (!themeData) return;
    const root = window.document.documentElement;
    
    root.style.setProperty('--primary-rose', themeData.primary);
    root.style.setProperty('--secondary-rose-gold', themeData.secondary);
    root.style.setProperty('--background', themeData.background);
    root.style.setProperty('--surface', themeData.surface);
    root.style.setProperty('--dark-section', themeData.darkSection);
    root.style.setProperty('--accent-gold', themeData.accentGold);
    root.style.setProperty('--text-primary', themeData.textPrimary);
    root.style.setProperty('--text-secondary', themeData.textSecondary);
    root.style.setProperty('--success', themeData.success);

    // Derived gradients
    root.style.setProperty('--gradient-primary', themeData.gradientPrimary || `linear-gradient(135deg, ${themeData.primary} 0%, ${themeData.secondary} 100%)`);
    root.style.setProperty('--gradient-dark', themeData.gradientDark || `linear-gradient(135deg, ${themeData.darkSection} 0%, #1a1515 100%)`);
    root.style.setProperty('--gradient-gold', themeData.gradientGold || `linear-gradient(135deg, ${themeData.accentGold} 0%, ${themeData.secondary} 100%)`);

    // Dynamic RGBA strings
    root.style.setProperty('--shadow-rose', themeData.shadowRose || hexToRgbaStr(themeData.primary, 0.25));
    root.style.setProperty('--border-soft', themeData.borderSoft || hexToRgbaStr(themeData.primary, 0.18));
  };

  // Subscribe to live theme updates from Firestore
  useEffect(() => {
    const unsubscribe = subscribeActiveTheme(
      (data) => {
        setActiveThemeData(data);
        applyThemeToDom(data);
        setLoadingTheme(false);
      },
      (error) => {
        console.error('Real-time theme subscription failed, falling back to Rose Gold:', error);
        setActiveThemeData(THEME_PRESETS[0]);
        applyThemeToDom(THEME_PRESETS[0]);
        setLoadingTheme(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Update light/dark mode attribute
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      isDark: theme === 'dark',
      activeThemeData,
      loadingTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
