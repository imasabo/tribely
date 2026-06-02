/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6',
        foreground: '#1F2937',
        card: '#FFFFFF',
        primary: '#0F766E',
        'primary-foreground': '#FFFFFF',
        secondary: '#F0FDF9',
        'secondary-foreground': '#0F766E',
        muted: '#F3F4F6',
        'muted-foreground': '#6B7280',
        accent: '#D97706',
        'accent-foreground': '#FFFFFF',
        destructive: '#EF4444',
        border: 'rgba(31, 41, 55, 0.08)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
