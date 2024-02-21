import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#A08DEF',
        secondary: '#4C4B7F',
        tertiary: '#2D2E4E',
        success: '#4AB637',
        warning: '#D5A84C',
        error: '#CF512F',
        surface: '#080812',
      }
    },
  },
  plugins: [],
} satisfies Config;
