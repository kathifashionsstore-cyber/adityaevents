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
        gold: {
          DEFAULT: '#D4AF37',
          deep: '#B8860B',
          rich: '#FFD700',
          champagne: '#F7E7CE',
          rose: '#E8B4A0',
        },
        burgundy: '#722F37',
        ivory: '#FFFFF0',
        success: '#2ECC71',
        danger: '#E74C3C',
        velvet: '#1C0A2E',       /* Deep Velvet Purple */
        amethyst: '#2D1B4E',     /* Dark Amethyst */
        royal: '#3D2464',        /* Royal Purple */
        cream: '#FFF9F0',        /* Warm Cream */
        ivoryWarm: '#FDF8F0',    /* Warm Ivory */
        cardDark: '#3A1F5C',     /* Deep Purple Card */
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
