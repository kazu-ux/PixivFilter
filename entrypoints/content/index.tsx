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
        const newValue: string[] = changes.blockTags.newValue;
        sessionStorage.setItem('pf-blockTags', JSON.stringify(newValue));
      }
      if (changes.blockUsers) {
        console.log('changed blockUsers');
        const newValue: BlockUser[] = changes.blockUsers.newValue;
        sessionStorage.setItem('pf-blockUsers', JSON.stringify(newValue));
      }
    });

    const blockTags = await ChromeStorage.getBlockTags();
    const blockUsers = await ChromeStorage.getBlockUsers();

    // ブラウザのローカルストレージに保存
    sessionStorage.setItem('pf-blockTags', JSON.stringify(blockTags));
    sessionStorage.setItem('pf-blockUsers', JSON.stringify(blockUsers));

    const getAllLiElements = () => document.querySelectorAll('li');

    const setTagContainer = async (worksData: WorksData) => {
      console.log('setTagContainer');

      const allLiElements = getAllLiElements();
      console.log(allLiElements);

      if (allLiElements.length === 0) return;

      worksData.forEach((workData) => {
        allLiElements.forEach((element) => {
          const workId = element.querySelector('a')?.href.split('/').pop();
          const tagContainerElement =
            element.querySelector('.pf-tag-container');

          if (tagContainerElement) return;
          if (workId !== workData.id) return;

          element.append(createTagContainer(workData.tags));
        });
      });
      return;
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
      )
        .filter((element) => {
          return element.outerHTML.includes('/users/');
        })
        .filter((element) => (element as HTMLElement).closest('ul'));

      targetElements.forEach((element) => {
        const wrapperElement = element.closest('.pf-wrapper');
        if (wrapperElement) return;
        // ラッパーを作成
        const wrapper = document.createElement('div');
        wrapper.className = 'pf-wrapper'; // 必要に応じてクラス名を付ける

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
          const isNovel = element
            .closest('li')
            ?.querySelector('a')
            ?.getAttribute('href')
            ?.startsWith('/novel/');
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

      await setUserNGButton();
      await setTagToggleButton();
      await setBlockButtonTagForNovel();
    }, 500);

    console.log('content script');
  },
});
