const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 90000,
  use: {
    headless: false,
    video: 'on',
    screenshot: 'on',
  },
  reporter: [['html', { open: 'never' }], ['list']],
});
