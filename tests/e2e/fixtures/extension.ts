import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

const extensionPath = path.resolve(process.cwd(), '.output/chrome-mv3');

/**
 * Chrome拡張機能を読み込んだブラウザコンテキストを提供するフィクスチャ
 *
 * テスト実行前に `pnpm build` でビルドしておく必要があります。
 */
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // テストごとに独立したブラウザコンテキストを作成
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      locale: 'ja-JP',
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--lang=ja',
      ],
    });
    await use(context);
    await context.close();
  },

  // 拡張機能のIDを取得（Service Worker URLから抽出）
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
