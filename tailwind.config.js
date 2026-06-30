/** @type {import('tailwindcss').Config} */

// Helper to support opacity modifiers with hex CSS variables via CSS color-mix
const withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, ${variableName} calc(${opacityValue} * 100%), transparent)`;
    }
    return variableName;
  };
};

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primaryRose: withOpacity('var(--primary-rose)'),
        secondaryRoseGold: withOpacity('var(--secondary-rose-gold)'),
        accentGold: withOpacity('var(--accent-gold)'),
        darkSection: withOpacity('var(--dark-section)'),
        textPrimary: withOpacity('var(--text-primary)'),
        textSecondary: withOpacity('var(--text-secondary)'),
        surface: withOpacity('var(--surface)'),
        background: withOpacity('var(--background)'),
        charcoal: withOpacity('var(--dark-section)'),
        champagne: withOpacity('var(--secondary-rose-gold)'),
        gold: {
          DEFAULT: withOpacity('var(--accent-gold)'),
          deep: withOpacity('var(--primary-rose)'),
          rich: withOpacity('var(--secondary-rose-gold)'),
          champagne: withOpacity('var(--secondary-rose-gold)'),
          rose: withOpacity('var(--secondary-rose-gold)'),
        },
        burgundy: withOpacity('var(--primary-rose)'),
        ivory: withOpacity('var(--background)'),
        success: withOpacity('var(--success)'),
        danger: withOpacity('#E74C3C'),
        velvet: withOpacity('var(--dark-section)'),
        amethyst: withOpacity('var(--primary-rose)'),
        royal: withOpacity('var(--secondary-rose-gold)'),
        cream: withOpacity('var(--background)'),
        ivoryWarm: withOpacity('var(--background)'),
        cardDark: withOpacity('var(--surface)'),
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
        accent: ['"Great Vibes"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
