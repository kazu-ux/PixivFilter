import { expect, test } from './fixtures/extension';

const TEST_URL = 'https://www.pixiv.net/tags/風景';

test.beforeEach(async ({ context }) => {
  // テスト前に chrome.storage をクリア
  const [sw] = context.serviceWorkers();
  const serviceWorker = sw ?? (await context.waitForEvent('serviceworker'));
  await serviceWorker.evaluate(() => {
    return chrome.storage.local.set({ blockUsers: [], blockTags: [] });
  });
});

test('コンテンツスクリプトが検索ページにUIを注入する', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(TEST_URL);

  // インターバル（500ms）が実行されるまで待機
  const blockButton = page.locator('.pf-user-ng-button').first();
  await expect(blockButton).toBeVisible({ timeout: 10000 });
});

test('ユーザーブロックボタンをクリックするとカードが非表示になる', async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto(TEST_URL);

  // コンテンツスクリプトが data-pf-user-id を付与するまで待機
  const firstCard = page.locator('[data-pf-user-id]').first();
  await expect(firstCard).toBeVisible({ timeout: 10000 });

  // ブロックボタンをクリック
  const blockButton = firstCard.locator('.pf-user-ng-button');
  await blockButton.click();

  // カードが非表示になることを確認
  await expect(firstCard).toHaveCSS('display', 'none', { timeout: 5000 });
});

test('ブロック済みユーザーの作品がページ読み込み時に非表示になる', async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto(TEST_URL);

  // コンテンツスクリプトが処理するまで待機し、ユーザーIDを取得
  const firstCard = page.locator('[data-pf-user-id]').first();
  await expect(firstCard).toBeVisible({ timeout: 10000 });
  const userId = await firstCard.getAttribute('data-pf-user-id');
  if (!userId) throw new Error('data-pf-user-id が取得できませんでした');

  // Service Worker 経由で chrome.storage にブロックユーザーを設定
  const [sw] = context.serviceWorkers();
  const serviceWorker = sw ?? (await context.waitForEvent('serviceworker'));
  await serviceWorker.evaluate((uid) => {
    return chrome.storage.local.set({
      blockUsers: [{ userId: uid, userName: 'Test User' }],
    });
  }, userId);

  // ページをリロード
  await page.reload();

  // コンテンツスクリプトが処理済みであることを確認（他のカードに data-pf-user-id が付与されるまで待機）
  await expect(page.locator('[data-pf-user-id]').first()).toBeAttached({
    timeout: 10000,
  });

  // fetch インターセプトにより JSON から削除されるため、ブロックしたユーザーのカードが DOM に存在しないことを確認
  await expect(page.locator(`[data-pf-user-id="${userId}"]`)).toHaveCount(0);
});

test('タグトグルボタンをクリックするとタグコンテナが表示される', async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto(TEST_URL);

  // タグコンテナが DOM に追加されるまで待機（filter.js の fetch インターセプト後に追加される）
  await page
    .locator('.pf-tag-container')
    .first()
    .waitFor({ state: 'attached', timeout: 20000 });

  // トグルボタンとタグコンテナの両方を持つカードを filter() で特定
  const card = page
    .locator('li')
    .filter({ has: page.locator('.pf-tag-toggle-button') })
    .filter({ has: page.locator('.pf-tag-container') })
    .first();
  await expect(card).toBeAttached();

  const toggleButton = card.locator('.pf-tag-toggle-button');
  const tagContainer = card.locator('.pf-tag-container');

  // 初期状態: タグコンテナは非表示、ボタンテキストは ▼
  await expect(tagContainer).toHaveCSS('display', 'none');
  await expect(toggleButton).toHaveText('▼');

  // クリック後: タグコンテナが表示され、ボタンテキストが ▲ になる
  await toggleButton.click();
  await expect(tagContainer).not.toHaveCSS('display', 'none');
  await expect(toggleButton).toHaveText('▲');
});

test('タグトグルボタンを再度クリックするとタグコンテナが非表示になる', async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto(TEST_URL);

  // タグコンテナが DOM に追加されるまで待機
  await page
    .locator('.pf-tag-container')
    .first()
    .waitFor({ state: 'attached', timeout: 20000 });

  // トグルボタンとタグコンテナの両方を持つカードを特定
  const card = page
    .locator('li')
    .filter({ has: page.locator('.pf-tag-toggle-button') })
    .filter({ has: page.locator('.pf-tag-container') })
    .first();
  await expect(card).toBeAttached();

  const toggleButton = card.locator('.pf-tag-toggle-button');
  const tagContainer = card.locator('.pf-tag-container');

  // 1回目クリック: タグコンテナを表示
  await toggleButton.click();
  await expect(tagContainer).not.toHaveCSS('display', 'none');
  await expect(toggleButton).toHaveText('▲');

  // 2回目クリック: タグコンテナが再び非表示になる
  await toggleButton.click();
  await expect(tagContainer).toHaveCSS('display', 'none');
  await expect(toggleButton).toHaveText('▼');
});

test('SPA遷移後もユーザーブロック機能が正常に動作する', async ({ context }) => {
  const page = await context.newPage();
  await page.goto(TEST_URL);

  // ユーザーをブロック
  const firstCard = page.locator('[data-pf-user-id]').first();
  await expect(firstCard).toBeVisible({ timeout: 10000 });
  const userId = await firstCard.getAttribute('data-pf-user-id');
  if (!userId) throw new Error('data-pf-user-id が取得できませんでした');

  await firstCard.locator('.pf-user-ng-button').click();
  await expect(firstCard).toHaveCSS('display', 'none', { timeout: 5000 });

  // SPA遷移: artworks タブへのリンクをクリック（クライアントサイドナビゲーション）
  // Pixiv のタグページには /tags/[tag]/artworks などのサブパスタブがある
  // /tags/ を含む URL への遷移なのでコンテンツスクリプトのインターバルは継続動作する
  await page.locator('a[href$="/illustrations"]').first().click();
  await expect(page).toHaveURL(/\/illustrations/, { timeout: 10000 });

  // SPA遷移後もコンテンツスクリプトのインターバルが継続動作していることを確認
  await expect(page.locator('.pf-user-ng-button').first()).toBeVisible({
    timeout: 15000,
  });

  // filter.ts が新しいフェッチリクエストを処理済みであることを確認
  // タグコンテナが DOM に追加されていれば filter.ts → content script のパイプラインが動作している
  await page
    .locator('.pf-tag-container')
    .first()
    .waitFor({ state: 'attached', timeout: 20000 });

  // SPA遷移後の新コンテンツにもブロックが適用され、ブロックしたユーザーの作品が DOM に存在しないことを確認
  await expect(page.locator(`[data-pf-user-id="${userId}"]`)).toHaveCount(0);
});

test('タグブロックボタンをクリックするとタグ付き作品が非表示になる', async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto(TEST_URL);

  // タグトグルボタンが表示されるまで待機
  const toggleButton = page.locator('.pf-tag-toggle-button').first();
  await expect(toggleButton).toBeVisible({ timeout: 10000 });

  // タグコンテナを開く
  await toggleButton.click();

  // タグブロックボタンを取得してタグ名を確認
  const tagBlockButton = page
    .locator('.pf-tag-ng-button[data-tag-name]')
    .first();
  await expect(tagBlockButton).toBeVisible({ timeout: 5000 });
  const tagName = await tagBlockButton.getAttribute('data-tag-name');
  if (!tagName) throw new Error('data-tag-name が取得できませんでした');

  // タグブロックボタンをクリック
  await tagBlockButton.click();

  // そのタグが付いた作品カードが非表示になることを確認
  const taggedCard = page
    .locator(`[data-tag-name="${tagName}"]`)
    .locator('..')
    .locator('..')
    .locator('..')
    .first();
  await expect(
    page.locator(`li:has([data-tag-name="${tagName}"])`).first(),
  ).toHaveCSS('display', 'none', { timeout: 5000 });
});
