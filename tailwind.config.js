const { colors } = require('./src/constants/tokens.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        foreground: colors.foreground,
        card: colors.card,
        primary: colors.primary,
        'primary-foreground': colors.primaryForeground,
        secondary: colors.secondary,
        'secondary-foreground': colors.secondaryForeground,
        muted: colors.muted,
        'muted-foreground': colors.mutedForeground,
        accent: colors.accent,
        'accent-foreground': colors.accentForeground,
        destructive: colors.destructive,
        border: colors.border,
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
