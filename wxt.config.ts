import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Pixiv Filter',
    description: 'PixivでNG登録したユーザーやタグの作品を非表示にします。',
    default_locale: 'en',
    permissions: ['storage'],
    host_permissions: [],
    action: {},
    web_accessible_resources: [
      { resources: ['filter.js'], matches: ['https://www.pixiv.net/*'] },
    ],
  },

  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      const browserType = wxt.config.browser;
      console.log(browserType);

      wxt.config.runnerConfig.config.startUrls =
        browserType === 'firefox'
          ? ['about:debugging#/runtime/this-firefox']
          : [];

      // 開発モードの場合は名前を変更する
      if (wxt.config.command === 'serve' || wxt.config.mode === 'development') {
        manifest.name = 'Pixiv Filter dev';
      }
    },
  },

  webExt: {
    chromiumArgs: ['https://www.pixiv.net/tags/%E9%A2%A8%E6%99%AF'],
  },
});
