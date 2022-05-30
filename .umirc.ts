import { defineConfig } from 'dumi';

export default defineConfig({
  title: '狸猫IM',
  favicon:
    '/images/logo.png',
  logo: '/images/logo.png',
  outputPath: 'docs-dist',
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  // more config: https://d.umijs.org/config
});
