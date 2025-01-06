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

          // if (workId !== workData.id) return;
          element.append(createTagContainer(workData.tags));
        });
      });
      return;
    };

    const setWorkHiddenFlag = async (worksData: WorksData) => {
      // ブロックタグとブロックユーザーが含まれている作品のみを抽出
      const filteredWorksData = worksData.filter((workData) => {
        return (
          workData.tags.some((tag) => blockTags.includes(tag)) ||
          blockUsers.map((user) => user.userId).includes(workData.userId)
        );
      });

      const allLiElements = getAllLiElements();
      if (allLiElements.length === 0) return console.log('no li');
      for await (const workData of filteredWorksData) {
        for await (const element of allLiElements) {
          const workId = element.querySelector('a')?.href.split('/').pop();
          if (workId !== workData.id) continue;
          element.classList.add('pf-hidden');
        }
      }
    };

    const showWorkElements = async () => {
      const LiElements = document.querySelectorAll('li');
      if (LiElements.length === 0) return console.log('no li');
      LiElements.forEach((element) => {
        if (element.classList.contains('pf-hidden')) {
          element.style.display = 'none';
          return;
        }
        element.style.display = 'block';
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

    const interval = setInterval(async () => {
      // 開いているページが検索結果ページかどうかを判定する
      if (!document.location.href.startsWith('https://www.pixiv.net/tags/')) {
        return;
      }
      // await showWorkElements();
      const targetElements = Array.from(
        document.querySelectorAll<HTMLElement>('[aria-haspopup]')
      ).filter((element) => {
        return element.outerHTML.includes('/users/');
      });

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
          element.closest('span')?.append(createTagBlockButton(tag));
        });
      };

      await setUserNGButton();
      await setTagToggleButton();
      // await setBlockButtonTagForNovel();
    }, 500);

    console.log('content script');
  },
});
