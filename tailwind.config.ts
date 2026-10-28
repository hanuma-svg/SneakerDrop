import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#11110F',
        paper: '#F3F0E8',
        lime: '#D8FF3E',
        rust: '#B86A4A',
        graphite: '#2A2A26',
        mist: '#A8A69E',
      },
      fontFamily: {
        sans: ['var(--font-space)', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        editorial: '0 18px 50px rgba(17, 17, 15, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
