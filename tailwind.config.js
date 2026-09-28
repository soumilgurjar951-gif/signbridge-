/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Single accent: rose. Warm, human, premium.
        indigo: { DEFAULT: '#E11D48', deep: '#9F1239', ink: '#4C0519' },
        teal: { DEFAULT: '#E11D48', bright: '#FB7185', soft: '#FFE4E6', deep: '#9F1239' },
        lavender: { 50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185' },
        // Dark surfaces: warm charcoal
        navy: { 900: '#1C1216', 800: '#2A1A20', 700: '#3B232C', 600: '#52303B' },
        cream: '#fafaf9',
      },
      fontFamily: { sans: ['var(--font-inter)', 'Inter', 'SF Pro Display', 'system-ui', 'sans-serif'] },
      boxShadow: {
        soft: '0 8px 30px -6px rgba(159, 18, 57, 0.20), 0 2px 8px -2px rgba(244, 63, 94, 0.12)',
        glow: '0 0 0 4px rgba(244, 63, 94, 0.18), 0 12px 40px -8px rgba(244, 63, 94, 0.55)',
        card: '0 20px 60px -20px rgba(76, 5, 25, 0.30)',
        lift: '0 24px 60px -12px rgba(159, 18, 57, 0.35)',
      },
      animation: { float: 'float 6s ease-in-out infinite', 'float-slow': 'float 9s ease-in-out infinite', shimmer: 'shimmer 2.2s linear infinite', 'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite', wave: 'wave 2.5s ease-in-out infinite', morph: 'morph 8s ease-in-out infinite' },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseSoft: { '0%, 100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.85', transform: 'scale(1.03)' } },
        wave: { '0%, 100%': { transform: 'rotate(0deg)' }, '25%': { transform: 'rotate(14deg)' }, '75%': { transform: 'rotate(-10deg)' } },
        morph: { '0%, 100%': { opacity: '1' }, '45%': { opacity: '1' }, '50%': { opacity: '0' }, '95%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
};
