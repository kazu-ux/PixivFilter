import ReactDOM from 'react-dom/client';
import { ChromeStorage } from '../utils/chrome_storage';

import './styles/style.css';
import App from './App';
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
    const blockTags = await ChromeStorage.getBlockTags();
    const blockUsers = await ChromeStorage.getBlockUsers();

    // ブラウザのローカルストレージに保存
    localStorage.setItem('blockTags', JSON.stringify(blockTags));
    localStorage.setItem('blockUsers', JSON.stringify(blockUsers));

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

    const getLiElement = (workId: string) => {
      const aElements = document.querySelectorAll(
        `[data-gtm-value="${workId}"]`
      );

      const LiElements = Array.from(aElements).flatMap((element) => {
        return element.closest('li') ?? [];
      });

      return LiElements;
    };

    const setTagContainer = async (worksData: WorksData) => {
      worksData.forEach((workData) => {
        const LiElements = getLiElement(workData.id);

        if (LiElements.length === 0) return;

        LiElements.forEach((element) => {
          const tagContainerElement =
            element.querySelector('.pf-tag-container');

          if (tagContainerElement) return;
          element.append(createTagContainer(workData.tags));
        });
      });
      return;
    };

    const setWorkHiddenFlag = async (worksData: WorksData) => {
      worksData.forEach((workData) => {
        const LiElements = getLiElement(workData.id);

        if (LiElements.length === 0) return;

        LiElements.forEach((element) => {});
      });
      return;
    };

    window.addEventListener('message', async (event) => {
      const message: WorksData = event.data;
      if (message.length === 0 || event.origin !== 'https://www.pixiv.net')
        return;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await setTagContainer(message);
    });

    const interval = setInterval(async () => {
      // 開いているページが検索結果ページかどうかを判定する
      if (!document.location.href.startsWith('https://www.pixiv.net/tags/'))
        return;

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
          // 小説かどうかを判定する

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
    }, 1000);

    console.log('content script');
  },
});
