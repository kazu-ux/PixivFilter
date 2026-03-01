import { ChromeStorage } from '../utils/chrome_storage';

import './styles/style.css';
import {
  createTagBlockButton,
  createTagContainer,
  createTagToggleButton,
  createUserBlockButton,
} from './create_elements';

export default defineContentScript({
  matches: ['https://www.pixiv.net/*'],
  runAt: 'document_start',

  async main(ctx) {
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', chrome.runtime.getURL('filter.js'));
    script.addEventListener('load', () => {
      console.log('load');
    });

    const head =
      document.head ||
      document.getElementsByTagName('head')[0] ||
      document.documentElement;
    head.insertBefore(script, head.lastChild);

    // --- In-memory block list cache ---
    let blockUsers: BlockUser[] = await ChromeStorage.getBlockUsers();
    let blockTags: string[] = await ChromeStorage.getBlockTags();
    let blockUserIds = new Set(blockUsers.map((u) => u.userId));

    // filter.ts (main world) は sessionStorage を参照するため同期を保つ
    sessionStorage.setItem('pf-blockUsers', JSON.stringify(blockUsers));
    sessionStorage.setItem('pf-blockTags', JSON.stringify(blockTags));

    chrome.storage.onChanged.addListener((changes) => {
      console.log({ changes });
      if (changes.blockTags) {
        blockTags = changes.blockTags.newValue as string[];
        sessionStorage.setItem('pf-blockTags', JSON.stringify(blockTags));
      }
      if (changes.blockUsers) {
        blockUsers = changes.blockUsers.newValue as BlockUser[];
        blockUserIds = new Set(blockUsers.map((u) => u.userId));
        sessionStorage.setItem('pf-blockUsers', JSON.stringify(blockUsers));
      }
      hideBlockedWorks();
    });

    // --- Helpers ---
    const getCardContainer = (element: HTMLElement): Element | null => {
      return element.closest('li') ?? element.closest('[class*="col-span"]');
    };

    const WORK_TAGS_CACHE_KEY = 'pf-work-tags';
    let workTagsCache: Record<string, string[]> = JSON.parse(
      sessionStorage.getItem(WORK_TAGS_CACHE_KEY) ?? '{}',
    );

    const targetUrls = ['/tags/', '/search'];
    const isTargetPage = () =>
      targetUrls.some((url) => location.href.includes(url));

    // --- Tag container ---
    const cacheWorkTags = (worksData: WorksData) => {
      worksData.forEach((workData) => {
        if (workData.tags?.length) {
          workTagsCache[workData.id] = workData.tags;
        }
      });
      sessionStorage.setItem(WORK_TAGS_CACHE_KEY, JSON.stringify(workTagsCache));
    };

    const setTagContainer = (worksData: WorksData) => {
      console.log('setTagContainer');
      cacheWorkTags(worksData);

      worksData.forEach((workData) => {
        const artworkLink = document.querySelector<HTMLElement>(
          `a[data-gtm-value="${workData.id}"][href*="/artworks/"]`,
        );
        if (!artworkLink) return;

        const cardContainer = getCardContainer(artworkLink);
        if (!cardContainer) return;
        if (cardContainer.querySelector('.pf-tag-container')) return;

        cardContainer.append(createTagContainer(workData.tags));
      });
    };

    window.addEventListener('message', async (event) => {
      const message: WorksData = event.data;
      if (message.length === 0) return console.log('message is empty');
      if (event.origin !== 'https://www.pixiv.net')
        return console.log({
          message: 'origin is not pixiv',
          origin: event.origin,
        });

      if (!Array.isArray(message)) {
        return console.log('message is not array');
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      setTagContainer(message);
    });

    // --- Hide blocked works (in-memory リストを使用) ---
    const hideBlockedWorks = () => {
      blockUsers.forEach(({ userId }) => {
        document
          .querySelectorAll<HTMLElement>(`[data-pf-user-id="${userId}"]`)
          .forEach((card) => {
            card.style.display = 'none';
          });
      });

      blockTags.forEach((tag) => {
        document
          .querySelectorAll<HTMLElement>(`[data-tag-name="${tag}"]`)
          .forEach((button) => {
            const card = getCardContainer(button);
            if (card instanceof HTMLElement) card.style.display = 'none';
          });
      });
    };

    // --- User element processing ---
    // data-gtm-value が React hydration 後に付与される場合があるため、
    // 設定できなかった場合は 1 秒後に 1 度だけ再試行する
    const trySetUserId = (element: HTMLElement): boolean => {
      const card =
        element.closest('li') ?? element.closest('[class*="col-span"]');
      if (!card || card.hasAttribute('data-pf-user-id')) return true;

      const userId = element
        .querySelector('[data-gtm-value][href*="/users/"]')
        ?.getAttribute('data-gtm-value');
      if (userId) {
        card.setAttribute('data-pf-user-id', userId);
        if (blockUserIds.has(userId)) {
          (card as HTMLElement).style.display = 'none';
        }
        return true;
      }
      return false;
    };

    const processUserElement = async (element: HTMLElement) => {
      if (!trySetUserId(element)) {
        setTimeout(() => trySetUserId(element), 1000);
      }

      if (element.closest('.pf-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'pf-wrapper';
      element.parentNode?.insertBefore(wrapper, element);
      wrapper.appendChild(element);

      wrapper.append(createUserBlockButton());

      const card =
        element.closest('li') ?? element.closest('[class*="col-span"]');
      const isNovel = !!card?.querySelector('a[href*="/novel/"]');
      if (!isNovel) {
        wrapper.append(await createTagToggleButton());
      }
    };

    const processNovelTags = (root: ParentNode = document) => {
      root
        .querySelectorAll('.gtm-novel-searchpage-result-tag')
        .forEach((element) => {
          const tag = element.getAttribute('data-gtm-label');
          if (!tag) return;
          if (element.closest('span')?.querySelector('.pf-tag-ng-button'))
            return;
          element.closest('span')?.append(createTagBlockButton(tag));
        });
    };

    const applyTagContainerFromCache = (root: ParentNode = document) => {
      root
        .querySelectorAll<HTMLElement>('a[data-gtm-value][href*="/artworks/"]')
        .forEach((link) => {
          const workId = link.getAttribute('data-gtm-value');
          if (!workId) return;

          const cardContainer = getCardContainer(link);
          if (!cardContainer) return;
          if (cardContainer.querySelector('.pf-tag-container')) return;

          const tags = workTagsCache[workId];
          if (!tags?.length) return;

          cardContainer.append(createTagContainer(tags));
        });
    };

    // outerHTML.includes() の代わりに querySelector を使用
    const findUserElements = (root: Element): HTMLElement[] =>
      Array.from(
        root.querySelectorAll<HTMLElement>('[aria-haspopup]'),
      ).filter((el) => el.querySelector('[href*="/users/"]'));

    const processAll = async () => {
      if (!isTargetPage()) return;
      const root = document.body ?? document.documentElement;
      const elements = findUserElements(root);
      await Promise.all(elements.map(processUserElement));
      processNovelTags();
      applyTagContainerFromCache();
      hideBlockedWorks();
    };

    // 初回処理
    await processAll();

    // --- MutationObserver (setInterval の代替) ---
    const observer = new MutationObserver(async (mutations) => {
      if (!isTargetPage()) return;

      const newUserElements: HTMLElement[] = [];
      const addedElements: HTMLElement[] = [];

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = node as HTMLElement;
          addedElements.push(el);

          if (
            el.matches?.('[aria-haspopup]') &&
            el.querySelector('[href*="/users/"]')
          ) {
            newUserElements.push(el);
          }
          findUserElements(el).forEach((child) => newUserElements.push(child));
        }
      }

      if (addedElements.length === 0) return;

      await Promise.all(newUserElements.map(processUserElement));

      addedElements.forEach((el) => {
        processNovelTags(el);
        applyTagContainerFromCache(el);
      });

      hideBlockedWorks();
    });

    observer.observe(document.body ?? document.documentElement, {
      childList: true,
      subtree: true,
    });

    console.log('content script');
  },
});
