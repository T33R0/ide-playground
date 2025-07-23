const theme = require('./tailwind-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.fontFamily,
      boxShadow: theme.boxShadow,
      borderRadius: theme.borderRadius,
      animation: theme.animation,
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
