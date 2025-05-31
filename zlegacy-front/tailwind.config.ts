import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a74da',
          dark: '#005ec2',
        },
        background: {
          DEFAULT: '#121212',
          dark: '#1e1e1e',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        urbanist: ['Urbanist', 'sans-serif'],
      },
      keyframes: {
        'neon-glow': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 24px #22d3ee) drop-shadow(0 0 48px #2563eb)',
            opacity: '0.85',
          },
          '50%': {
            filter: 'drop-shadow(0 0 40px #67e8f9) drop-shadow(0 0 80px #3b82f6)',
            opacity: '1',
          },
        },
        'pulse-halo': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.07) rotate(-2deg)',
            opacity: '0.85',
          },
        },
      },
      animation: {
        'neon-glow': 'neon-glow 2.2s infinite ease-in-out',
        'pulse-halo': 'pulse-halo 1.6s infinite cubic-bezier(0.4,0,0.6,1)',
      },
      boxShadow: {
        'neon': '0 0 40px 10px #22d3ee, 0 0 80px 20px #2563eb',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.ring-halo': {
          'box-shadow': '0 0 48px 16px #22d3ee, 0 0 96px 32px #2563eb',
          'background': 'radial-gradient(circle, #67e8f9 60%, #2563eb 100%)',
          'opacity': '0.7',
        },
      });
    },
  ],
};
export default config;
