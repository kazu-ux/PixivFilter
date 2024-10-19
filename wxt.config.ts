import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Pixiv Filter',
    description: 'PixivでNG登録したユーザーやタグの作品を非表示にします。',
    version: '1.3.1',
    default_locale: 'en',
    permissions: ['storage', 'scripting', 'webRequest'],
    host_permissions: [
      'https://www.pixiv.net/ajax/search/top/*',
      'https://www.pixiv.net/ajax/search/illustrations/*',
      'https://www.pixiv.net/ajax/search/manga/*',
      'https://www.pixiv.net/ajax/search/novels/*',
    ],
    action: {},

    // @ts-ignore: Valid MV3 key for chrome
    // optional_host_permissions: ['*://*/*'],
  },

  // hooks: {
  //   'build:manifestGenerated': (wxt, manifest) => {
  //     if (wxt.config.command === 'serve') {
  //       // During development, content script is not listed in manifest, causing
  //       // "webext-dynamic-content-scripts" to throw an error. So we need to
  //       // add it manually.
  //       manifest.content_scripts ??= [];
  //       manifest.content_scripts.push({
  //         matches: ['*://*.wxt.dev/*'],
  //         js: ['content-scripts/content.js'],
  //         // If the script has CSS, add it here.
  //       });
  //     }
  //   },
  // },

  // runner: {
  //   chromiumArgs: ['--devtools'],
  //   startUrls: ['https://www.pixiv.net/tags/%E9%A2%A8%E6%99%AF'],
  // },
});
