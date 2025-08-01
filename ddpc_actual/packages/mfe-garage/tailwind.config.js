
const sharedConfig = require('../shared-ui/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [
    '../shared-ui/src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
}; 