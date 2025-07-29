
const sharedTheme = require('../../host/tailwind-theme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
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