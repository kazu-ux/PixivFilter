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

    chrome.storage.onChanged.addListener(async (changes) => {
      console.log({ changes });
      if (changes.blockTags) {
        console.log('changed blockTags');
        const newValue = changes.blockTags.newValue as string[];
        sessionStorage.setItem('pf-blockTags', JSON.stringify(newValue));
      }
      if (changes.blockUsers) {
        console.log('changed blockUsers');
        const newValue = changes.blockUsers.newValue as BlockUser[];
        sessionStorage.setItem('pf-blockUsers', JSON.stringify(newValue));
      }
    });

    const blockTags = await ChromeStorage.getBlockTags();
    const blockUsers = await ChromeStorage.getBlockUsers();

    // ブラウザのローカルストレージに保存
    sessionStorage.setItem('pf-blockTags', JSON.stringify(blockTags));
    sessionStorage.setItem('pf-blockUsers', JSON.stringify(blockUsers));

    const getCardContainer = (element: HTMLElement): Element | null => {
      return element.closest('li') ?? element.closest('[class*="col-span"]');
    };

    const WORK_TAGS_CACHE_KEY = 'pf-work-tags';

    const cacheWorkTags = (worksData: WorksData) => {
      const cache = JSON.parse(
        sessionStorage.getItem(WORK_TAGS_CACHE_KEY) ?? '{}'
      ) as Record<string, string[]>;
      worksData.forEach((workData) => {
        if (workData.tags?.length) {
          cache[workData.id] = workData.tags;
        }
      });
      sessionStorage.setItem(WORK_TAGS_CACHE_KEY, JSON.stringify(cache));
    };

    const setTagContainer = async (worksData: WorksData) => {
      console.log('setTagContainer');
      cacheWorkTags(worksData);

      worksData.forEach((workData) => {
        const artworkLink = document.querySelector<HTMLElement>(
          `a[data-gtm-value="${workData.id}"][href*="/artworks/"]`
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

      // messageがarrayかどうかを判定する
      if (!Array.isArray(message)) {
        return console.log('message is not array');
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // await setWorkHiddenFlag(message);
      await setTagContainer(message);

      // await showWorkElements();
      return;
    });

    const targetUrls = ['/tags/'];

    const interval = setInterval(async () => {
      // 開いているページが対象ページかどうかを判定する
      if (!targetUrls.some((url) => location.href.includes(url))) return;

      const targetElements = Array.from(
        document.querySelectorAll<HTMLElement>('[aria-haspopup]')
      ).filter((element) => {
        return element.outerHTML.includes('/users/');
      });

      targetElements.forEach((element) => {
        const wrapperElement = element.closest('.pf-wrapper');
        if (wrapperElement) return;

        // カードコンテナにユーザーIDを付与して、即時非表示を可能にする
        const userId = element
          .querySelector('[data-gtm-value][href*="/users/"]')
          ?.getAttribute('data-gtm-value');
        if (userId) {
          const card =
            element.closest('li') ??
            element.closest('[class*="col-span"]');
          card?.setAttribute('data-pf-user-id', userId);
        }

        // ラッパーを作成
        const wrapper = document.createElement('div');
        wrapper.className = 'pf-wrapper';

        // 元の要素をラッパーに追加
        element.parentNode?.insertBefore(wrapper, element);
        wrapper.appendChild(element);
      });

      const setUserNGButton = async () => {
        targetElements.forEach((element) => {
          const blockButtonElement = element
            .closest('.pf-wrapper')
            ?.querySelector('.pf-user-ng-button');
          if (blockButtonElement) return;
          element.closest('.pf-wrapper')?.append(createUserBlockButton());
        });
      };

      const setTagToggleButton = async () => {
        targetElements.forEach(async (element) => {
          // 小説かどうかを判定して、小説の場合はreturn
          const card =
            element.closest('li') ?? element.closest('[class*="col-span"]');
          const isNovel = !!card?.querySelector('a[href*="/novel/"]');
          if (isNovel) return;

          const tagToggleButtonElement = element
            .closest('.pf-wrapper')
            ?.querySelector('.pf-tag-toggle-button');

          if (tagToggleButtonElement) return;

          element.closest('.pf-wrapper')?.append(await createTagToggleButton());
        });
      };

      const setBlockButtonTagForNovel = () => {
        const aElements = document.querySelectorAll(
          '.gtm-novel-searchpage-result-tag'
        );

        aElements.forEach((element) => {
          const tag = element.getAttribute('data-gtm-label');
          if (!tag) return;
          if (element.closest('span')?.querySelector('.pf-tag-ng-button'))
            return;
          element.closest('span')?.append(createTagBlockButton(tag));
        });
      };

      const hideBlockedWorks = () => {
        const blockUsers = JSON.parse(
          sessionStorage.getItem('pf-blockUsers') ?? '[]'
        ) as BlockUser[];
        const blockTags = JSON.parse(
          sessionStorage.getItem('pf-blockTags') ?? '[]'
        ) as string[];

        // ブロックユーザーの作品を非表示
        blockUsers.forEach(({ userId }) => {
          document
            .querySelectorAll<HTMLElement>(`[data-pf-user-id="${userId}"]`)
            .forEach((card) => {
              card.style.display = 'none';
            });
        });

        // ブロックタグの作品を非表示（タグコンテナが存在する場合）
        blockTags.forEach((tag) => {
          document
            .querySelectorAll<HTMLElement>(`[data-tag-name="${tag}"]`)
            .forEach((button) => {
              const card = getCardContainer(button);
              if (card instanceof HTMLElement) card.style.display = 'none';
            });
        });
      };

      const applyTagContainerFromCache = () => {
        const cache = JSON.parse(
          sessionStorage.getItem(WORK_TAGS_CACHE_KEY) ?? '{}'
        ) as Record<string, string[]>;

        document
          .querySelectorAll<HTMLElement>(
            'a[data-gtm-value][href*="/artworks/"]'
          )
          .forEach((link) => {
            const workId = link.getAttribute('data-gtm-value');
            if (!workId) return;

            const cardContainer = getCardContainer(link);
            if (!cardContainer) return;
            if (cardContainer.querySelector('.pf-tag-container')) return;

            const tags = cache[workId];
            if (!tags?.length) return;

            cardContainer.append(createTagContainer(tags));
          });
      };

      await setUserNGButton();
      await setTagToggleButton();
      await setBlockButtonTagForNovel();
      applyTagContainerFromCache();
      hideBlockedWorks();
    }, 500);

    console.log('content script');
  },
});
