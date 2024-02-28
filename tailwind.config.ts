import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      tertiary: 'var(--color-tertiary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      surface: {
        DEFAULT: 'var(--color-surface)',
        100: 'var(--color-surface-100)',
        200: 'var(--color-surface-200)',
        300: 'var(--color-surface-300)',
      },
      foreground: "#E9E9F0",
      black: "#000000",
    },
    extend: {
      fontFamily: {
        'inter': ['Inter', 'monospace'],
        'plex-mono': ['IBM Plex Mono', 'monospace'],
      }
    },
  },
  plugins: [],
} satisfies Config;
