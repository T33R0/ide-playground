const path = require('path');
const sharedConfig = require('../shared-ui/tailwind.config.js');

const sharedContent = sharedConfig.content.map((p) => {
  return path.resolve(__dirname, `../shared-ui/${p}`);
});

module.exports = {
  ...sharedConfig,
  content: [
    ...sharedContent,
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
};