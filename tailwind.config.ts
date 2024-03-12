const colors = require('tailwindcss/colors');
const tailwindRadix = require('tailwind-radix-colors');

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      amber: tailwindRadix.colors.amber,
      amberA: tailwindRadix.colors.amberA,
      white: "var(--color-white)",
      black: "var(--color-black)",
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      error: "var(--color-error)",
      info: "var(--color-info)",
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      tertiary: "var(--color-tertiary)",
      surface: {
        1: "var(--color-token-mercury-1)",
        2: "var(--color-token-mercury-2)",
        3: "var(--color-token-mercury-3)",
        4: "var(--color-token-mercury-4)",
        5: "var(--color-token-mercury-5)",
        6: "var(--color-token-mercury-6)",
        7: "var(--color-token-mercury-7)",
        8: "var(--color-token-mercury-8)",
        9: "var(--color-token-mercury-9)",
        10: "var(--color-token-mercury-10)",
        11: "var(--color-token-mercury-11)",
        12: "var(--color-token-mercury-12)",
      },
      foreground: "var(--color-foreground)",
      "foreground-muted": "var(--color-surface-5)",
      "foreground-muted-icon": "var(--color-foreground-muted-icon)",
      "border-default": "var(--color-border-default)",
      "border-muted": "var(--color-border-muted)",
      "border-strong": "var(--color-border-strong)",
      "on-primary": "var(--color-on-primary)",
      "on-secondary": "var(--color-on-secondary)",
      "on-success": "var(--color-on-success)",
      "on-error": "var(--color-on-error)",
      "on-warning": "var(--color-on-warning)",
      "page-background": "var(--color-page-background)",

      transparent: colors.transparent,
      "custom-purple": "rgba(160, 141, 239, 0.2)",

    },
    plugins: [
      tailwindRadix.plugin({
        prefix: 'rx', // default: rx
      })
    ],
    extend: {
      fontFamily: {
        inter: ["Inter", "monospace"],
        "plex-mono": ["IBM Plex Mono", "monospace"],
      },
    },
  },

} satisfies Config;
