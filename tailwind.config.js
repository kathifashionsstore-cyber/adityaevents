/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primaryRose: 'var(--primary-rose)',
        secondaryRoseGold: 'var(--secondary-rose-gold)',
        accentGold: 'var(--accent-gold)',
        darkSection: 'var(--dark-section)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        gold: {
          DEFAULT: 'var(--accent-gold)',
          deep: 'var(--primary-rose)',
          rich: 'var(--secondary-rose-gold)',
          champagne: 'var(--secondary-rose-gold)',
          rose: 'var(--secondary-rose-gold)',
        },
        burgundy: 'var(--primary-rose)',
        ivory: 'var(--background)',
        success: 'var(--success)',
        danger: '#E74C3C',
        velvet: 'var(--dark-section)',
        amethyst: 'var(--primary-rose)',
        royal: 'var(--secondary-rose-gold)',
        cream: 'var(--background)',
        ivoryWarm: 'var(--background)',
        cardDark: 'var(--surface)',
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
