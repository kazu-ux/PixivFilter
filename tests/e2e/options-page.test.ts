import { expect, test } from './fixtures/extension';
import type { BrowserContext } from '@playwright/test';

const getServiceWorker = async (context: BrowserContext) => {
  const [serviceWorker] = context.serviceWorkers();
  return serviceWorker ?? (await context.waitForEvent('serviceworker'));
};

test.beforeEach(async ({ context }) => {
  const serviceWorker = await getServiceWorker(context);
  await serviceWorker.evaluate(() => {
    return chrome.storage.local.set({ blockUsers: [], blockTags: [] });
  });
});

test('タグを追加し、重複登録を拒否する', async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  const tagSelect = page.locator('select.tag-select');
  await expect(tagSelect).toBeAttached();
  await page.locator('.tag-add-button').click();
  await page.locator('input[name="keyword"]').fill('landscape');
  await page.locator('.modal_overlay form button[type="submit"]').click();

  await expect(tagSelect.locator('option')).toHaveCount(1);
  await expect(tagSelect.locator('option')).toHaveText('landscape');
  await expect(page.locator('.tags-count')).toHaveText('(1)');

  const serviceWorker = await getServiceWorker(context);
  await expect
    .poll(() =>
      serviceWorker.evaluate(() => chrome.storage.local.get('blockTags'))
    )
    .toEqual({ blockTags: ['landscape'] });

  await page.locator('.tag-add-button').click();
  await page.locator('input[name="keyword"]').fill('landscape');
  await expect(page.locator('.modal_overlay [hidden]')).toHaveCount(0);
  await page.locator('.modal_overlay form button[type="submit"]').click();
  await expect(tagSelect.locator('option')).toHaveCount(1);
  await expect(page.locator('.tags-count')).toHaveText('(1)');
});

test('選択したタグだけを削除する', async ({ context, extensionId }) => {
  const serviceWorker = await getServiceWorker(context);
  await serviceWorker.evaluate(() => {
    return chrome.storage.local.set({
      blockUsers: [],
      blockTags: ['landscape', 'portrait', 'illustration'],
    });
  });

  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html`);
  const tagSelect = page.locator('select.tag-select');
  await expect(tagSelect.locator('option')).toHaveCount(3);
  await tagSelect.selectOption(['landscape', 'illustration']);
  await page.locator('.tag-remove-button').click();

  await expect(tagSelect.locator('option')).toHaveCount(1);
  await expect(tagSelect.locator('option')).toHaveText('portrait');
  await expect(page.locator('.tags-count')).toHaveText('(1)');
  await expect
    .poll(() =>
      serviceWorker.evaluate(() => chrome.storage.local.get('blockTags'))
    )
    .toEqual({ blockTags: ['portrait'] });
});

test('ユーザーを追加し、重複IDの送信を拒否する', async ({
  context,
  extensionId,
}) => {
  const page = await context.newPage();
  await page.route('https://www.pixiv.net/users/12345', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({
        props: { pageProps: { meta: { ogp: { title: 'Test Artist' } } } },
      })}</script>`,
    })
  );
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  const userSelect = page.locator('select.user-select');
  await expect(userSelect).toBeAttached();
  await userSelect.locator('xpath=..').locator('.button-container > button').first().click();
  await page.locator('.modal_overlay input[name="q"]').fill('https://www.pixiv.net/users/12345');
  await page.locator('.modal_overlay form button[type="submit"]').click();

  await expect(userSelect.locator('option')).toHaveCount(1, { timeout: 10000 });
  await expect(userSelect.locator('option')).toHaveText('Test Artist');
  await expect(page.locator('.users-count')).toHaveText('(1)');

  const serviceWorker = await getServiceWorker(context);
  await expect
    .poll(() =>
      serviceWorker.evaluate(() => chrome.storage.local.get('blockUsers'))
    )
    .toEqual({ blockUsers: [{ userName: 'Test Artist', userId: '12345' }] });

  await userSelect.locator('xpath=..').locator('.button-container > button').first().click();
  const userInput = page.locator('.modal_overlay input[name="q"]');
  await userInput.fill('12345');
  await expect(page.locator('.modal_overlay form button[type="submit"]')).toBeDisabled();
  await expect(page.locator('.user-hidden')).toBeVisible();
  await expect(userSelect.locator('option')).toHaveCount(1);
});

test('送信時にも重複ユーザーIDを登録しない', async ({
  context,
  extensionId,
}) => {
  const serviceWorker = await getServiceWorker(context);
  await serviceWorker.evaluate(() => {
    return chrome.storage.local.set({
      blockUsers: [{ userName: 'Existing Artist', userId: '12345' }],
      blockTags: [],
    });
  });

  const page = await context.newPage();
  await page.route('https://www.pixiv.net/users/12345', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({
        props: { pageProps: { meta: { ogp: { title: 'Duplicate Artist' } } } },
      })}</script>`,
    })
  );
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  const userSelect = page.locator('select.user-select');
  await expect(userSelect.locator('option')).toHaveCount(1);
  await userSelect
    .locator('xpath=..')
    .locator('.button-container > button')
    .first()
    .click();
  await page.locator('.modal_overlay input[name="q"]').fill('12345');
  await page.locator('.modal_overlay form').evaluate((form: HTMLFormElement) => {
    form.requestSubmit();
  });

  await expect(page.locator('.user-hidden')).toBeVisible();
  await expect(userSelect.locator('option')).toHaveCount(1);
  await expect
    .poll(() => serviceWorker.evaluate(() => chrome.storage.local.get('blockUsers')))
    .toEqual({ blockUsers: [{ userName: 'Existing Artist', userId: '12345' }] });
});

test('ユーザー取得に失敗しても再試行できる', async ({
  context,
  extensionId,
}) => {
  const page = await context.newPage();
  page.on('dialog', (dialog) => dialog.accept());
  let shouldFail = true;
  await page.route('https://www.pixiv.net/users/12345', (route) =>
    shouldFail
      ? route.abort()
      : route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({
            props: { pageProps: { meta: { ogp: { title: 'Recovered Artist' } } } },
          })}</script>`,
        })
  );
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  await page
    .locator('select.user-select')
    .locator('xpath=..')
    .locator('.button-container > button')
    .first()
    .click();
  await page.locator('.modal_overlay input[name="q"]').fill('12345');
  const submit = page.locator('.modal_overlay form button[type="submit"]');
  await submit.click();
  await expect(page.locator('.modal_overlay')).toBeVisible({ timeout: 10000 });

  shouldFail = false;
  await page.locator('.modal_overlay form').evaluate((form: HTMLFormElement) => {
    form.requestSubmit();
  });
  await expect(page.locator('select.user-select option')).toHaveText(
    'Recovered Artist',
    { timeout: 10000 }
  );
});

test('選択したユーザーだけを削除する', async ({ context, extensionId }) => {
  const serviceWorker = await getServiceWorker(context);
  await serviceWorker.evaluate(() => {
    return chrome.storage.local.set({
      blockUsers: [
        { userName: 'Artist One', userId: '101' },
        { userName: 'Artist Two', userId: '202' },
        { userName: 'Artist Three', userId: '303' },
      ],
      blockTags: [],
    });
  });

  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html`);
  const userSelect = page.locator('select.user-select');
  await expect(userSelect.locator('option')).toHaveCount(3);
  await userSelect.selectOption(['101', '303']);
  await page.locator('.user-remove-button').click();

  await expect(userSelect.locator('option')).toHaveCount(1);
  await expect(userSelect.locator('option')).toHaveText('Artist Two');
  await expect(page.locator('.users-count')).toHaveText('(1)');
  await expect
    .poll(() =>
      serviceWorker.evaluate(() => chrome.storage.local.get('blockUsers'))
    )
    .toEqual({
      blockUsers: [{ userName: 'Artist Two', userId: '202' }],
    });
});
