/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,css}'],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0A0E1A',
          deep: '#0F1B3D',
        },
        card: {
          DEFAULT: '#141B2E',
          border: '#1E2840',
          hover: '#1A2238',
          inset: '#0F1525',
        },
        ice: {
          DEFAULT: '#7FC4E8',
          dark: '#5BA8CC',
          muted: 'rgba(127, 196, 232, 0.15)',
        },
        gold: {
          DEFAULT: '#E8B84B',
          muted: 'rgba(232, 184, 75, 0.15)',
        },
        heading: '#F2F3F7',
        subtle: '#8B94AD',
        success: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      maxWidth: {
        container: '1400px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(127, 196, 232, 0.08), 0 4px 24px rgba(0, 0, 0, 0.35)',
        'glow-sm': '0 0 16px rgba(127, 196, 232, 0.12)',
        'spark-glow': '0 0 32px rgba(127, 196, 232, 0.25), 0 0 64px rgba(127, 196, 232, 0.08)',
      },
    },
  },
  plugins: [],
};
