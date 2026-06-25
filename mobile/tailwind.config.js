/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          blue: '#0052FF',
          cyan: '#00F0FF',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        inter: ['Inter'],
      },
    },
  },
  plugins: [],
};
