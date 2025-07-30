
const sharedConfig = require('../shared-ui/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [
    ...sharedConfig.content.map(p => `../shared-ui/${p}`),
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
}; 