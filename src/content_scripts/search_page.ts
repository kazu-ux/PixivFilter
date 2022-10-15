import { ChromeStorage } from '../database/chrome_storage';
import '../css/style.css';

export default () => {
  const searchPage = async () => {
    setNovelFlag();
    await setUserNGButton();
    await setTagToggleButton();
    await setTagContainer();
    setNGButtonTagNovel();

    const ngUsers = await ChromeStorage.getBlockUsers();
    ngUsers.forEach((user) => {
      hideNGUserWorks(user.userId);
    });

    const ngTags = await ChromeStorage.getBlockTags();
    ngTags.forEach((tag) => {
      hideNGTagWorks(tag);
    });
  };

  const setNovelFlag = () => {
    const targetElements =
      document.querySelectorAll<HTMLElement>('[aria-haspopup]');
    targetElements.forEach((element) => {
      const childrenELementCount = element.parentElement?.childElementCount;
      if (childrenELementCount === 1) {
        element.setAttribute('is-novel', 'false');
      } else {
        element.setAttribute('is-novel', 'true');
      }
    });
  };

  // 各作品にNGユーザー追加ボタンを設置
  const setUserNGButton = async () => {
    //NGユーザー追加ボタンを生成
    const createNGUserAddButton = () => {
      const addButtonElement = document.createElement('span');
      addButtonElement.className = 'pf-user-ng-button';
      addButtonElement.setAttribute('data-type', 'add');

      addButtonElement.textContent = '[+]';
      addButtonElement.onclick = async (event) => {
        const userElement = (
          event.target as HTMLElement
        ).parentElement?.querySelector('[href*="users"]');
        const userId = userElement?.getAttribute('data-gtm-value') ?? '';
        const userName =
          userElement?.children[0]?.getAttribute('title') ??
          userElement?.textContent ??
          '';

        await ChromeStorage.setBlockUser({ userId, userName });
        hideNGUserWorks(userId);
        console.log(userId, userName);
        console.log(userElement);
      };
      return addButtonElement;
    };

    const targetElements = document.querySelectorAll('[aria-haspopup]');

    targetElements.forEach((element) => {
      const isNovel = element.getAttribute('is-novel');
      if (isNovel === 'false') {
        element.parentElement?.append(createNGUserAddButton());
      } else {
        element.append(createNGUserAddButton());
      }
    });
  };

  // user指定で作品を非表示にする
  const hideNGUserWorks = (ngUserId: string) => {
    const ngUserWorks: NodeListOf<HTMLElement> = document.querySelectorAll(
      `[data-gtm-value="${ngUserId}"]`
    );

    ngUserWorks.forEach((element) => {
      const liElement = element.closest('li');
      if (!liElement) return;
      liElement.style.display = 'none';
    });
  };

  const hideNGTagWorks = (NGTag: string) => {
    const ngTagWorks: NodeListOf<HTMLElement> = document.querySelectorAll(
      `[data-tag-name="${NGTag}"]`
    );

    ngTagWorks.forEach((element) => {
      const liElement = element.closest('li');
      if (!liElement) return;
      liElement.style.display = 'none';
    });
  };

  const createTagNGButton = (tag: string) => {
    const spanElementTagNgButton = document.createElement('span');
    spanElementTagNgButton.className = 'pf-tag-ng-button';
    spanElementTagNgButton.setAttribute('data-type', 'add');
    spanElementTagNgButton.setAttribute('data-tag-name', tag);
    spanElementTagNgButton.textContent = '[+]';
    spanElementTagNgButton.onclick = async (event) => {
      console.log(event.target);
      await ChromeStorage.setBlockTag(tag);
      hideNGTagWorks(tag);
      return;
    };
    return spanElementTagNgButton;
  };

  //タグコンテナを作成する
  const createTagContainer = (worksTags: string[]) => {
    const divElement = document.createElement('div');
    divElement.className = 'pf-tag-container';
    divElement.style.display = 'none';
    worksTags.forEach((tag) => {
      const pElement = document.createElement('p');
      pElement.className = 'pf-work-tag';

      const aElement = document.createElement('a');
      aElement.className = 'pf-work-tag-link';
      aElement.target = '-blank';
      aElement.href = `https://www.pixiv.net/tags/${tag}`;
      aElement.textContent = tag;

      const spanElementTagNgButton = createTagNGButton(tag);

      pElement.appendChild(aElement);
      pElement.appendChild(spanElementTagNgButton);

      divElement.appendChild(pElement);
    });
    return divElement;
  };

  const setTagContainer = async () => {
    const getLiElement = (workId: string) => {
      const aElements = document.querySelectorAll(
        `[data-gtm-value="${workId}"]`
      );

      const LiElements = Array.from(aElements).flatMap((element) => {
        return element.closest('li') ?? [];
      });

      return LiElements;
    };
    const worksData = await ChromeStorage.getWorksData();
    worksData.forEach((workData) => {
      const LiElements = getLiElement(workData.id);
      LiElements.forEach((element) => {
        element.append(createTagContainer(workData.tags));
      });
    });
    return;
  };

  const setTagToggleButton = async () => {
    const createTagToggleButton = async () => {
      const toggleButtonElement = document.createElement('span');
      toggleButtonElement.className = 'pf-tag-toggle-button';
      toggleButtonElement.textContent = '▼';
      toggleButtonElement.onclick = (event) => {
        const selectedTagContainer = (event.target as HTMLElement)
          .closest('li')
          ?.querySelector<HTMLElement>('.pf-tag-container');

        if (!selectedTagContainer) return;
        if (toggleButtonElement.textContent === '▼') {
          toggleButtonElement.textContent = '▲';
          selectedTagContainer.style.display = '';
        } else {
          toggleButtonElement.textContent = '▼';
          selectedTagContainer.style.display = 'none';
        }
      };
      return toggleButtonElement;
    };

    const targetElements = document.querySelectorAll('[aria-haspopup]');

    targetElements.forEach(async (element) => {
      const isNovel = element.getAttribute('is-novel');
      if (isNovel === 'false') {
        element.parentElement?.append(await createTagToggleButton());
      }
    });
  };

  const setNGButtonTagNovel = () => {
    const aElements = document.querySelectorAll(
      '.gtm-novel-searchpage-result-tag'
    );

    aElements.forEach((element) => {
      const tag = element.getAttribute('data-gtm-label');
      if (!tag) return;
      element.closest('span')?.append(createTagNGButton(tag));
    });
  };

  searchPage();
};
