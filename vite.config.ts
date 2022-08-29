import { crx, defineManifest } from '@crxjs/vite-plugin';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const manifest = defineManifest({
  manifest_version: 3,
  default_locale: 'en',
  name: 'Pixiv Filter',
  version: '1.2.0',
  description: '__MSG_Description__',
  icons: { 128: 'public/icons/128.png' },
  action: { default_popup: 'index.html' },
  options_page: 'index.html',
  permissions: ['storage', 'tabs', 'webRequest'],
  host_permissions: [
    'https://www.pixiv.net/ajax/search/top/*',
    'https://www.pixiv.net/ajax/search/illustrations/*',
    'https://www.pixiv.net/ajax/search/manga/*',
    'https://www.pixiv.net/ajax/search/novels/*',
  ],
  content_scripts: [
    {
      matches: ['https://www.pixiv.net/*'],
      run_at: 'document_start',
      js: ['src/content_script.ts'],
    },
  ],
  background: { service_worker: 'src/background.ts' },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
