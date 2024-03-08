import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      white: "var(--color-white)",
      black: "var(--color-black)",
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      tertiary: 'var(--color-tertiary)',
      surface: {
        DEFAULT: 'var(--color-surface)',
        50: 'var(--color-surface-50)',
        100: 'var(--color-surface-100)',
        200: 'var(--color-surface-200)',
        300: 'var(--color-surface-300)',
        500: 'var(--color-surface-500)',
      },
      foreground: "var(--color-foreground)",
      'foreground-muted': 'var(--color-foreground-muted)',
      'foreground-muted-icon': 'var(--color-foreground-muted-icon)',
      'border-default': 'var(--color-border-default)',
      'border-muted': 'var(--color-border-muted)',
      'border-strong': 'var(--color-border-strong)',
      'on-primary': 'var(--color-on-primary)',
      'on-secondary': 'var(--color-on-secondary)',
      'on-success': 'var(--color-on-success)',
      'on-error': 'var(--color-on-error)',
      'on-warning': 'var(--color-on-warning)',

      transparent: 'transparent',
      'custom-purple': 'rgba(160, 141, 239, 0.2)',
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
