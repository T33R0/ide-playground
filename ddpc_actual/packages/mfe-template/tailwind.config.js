
const sharedTheme = require('../../tailwind-theme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      ...sharedTheme
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} 