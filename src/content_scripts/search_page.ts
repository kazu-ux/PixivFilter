import { ChromeStorage } from '../database/chrome_storage';
import '../css/style.css';
import {
  createUserBlockButton,
  createTagContainer,
  createTagBlockButton,
  createTagToggleButton,
} from './Elements/create_elements';

// user指定で作品を非表示にする
export const hideNGUserWorks = (userId: string) => {
  const ngUserWorks: NodeListOf<HTMLElement> = document.querySelectorAll(
    `[data-gtm-value="${userId}"]`
  );

  ngUserWorks.forEach((element) => {
    const liElement = element.closest('li');
    if (!liElement) return;
    liElement.style.display = 'none';
  });
};

export const hideNGTagWorks = (tagName: string) => {
  const ngTagWorks: NodeListOf<HTMLElement> = document.querySelectorAll(
    `[data-tag-name="${tagName}"]`
  );

  ngTagWorks.forEach((element) => {
    const liElement = element.closest('li');
    if (!liElement) return;
    liElement.style.display = 'none';
  });
};

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

  const targetElements =
    document.querySelectorAll<HTMLElement>('[aria-haspopup]');

  const setNovelFlag = () => {
    targetElements.forEach((element) => {
      const childrenELementCount = element.parentElement?.childElementCount;
      if (childrenELementCount === 1) {
        element.setAttribute('is-novel', 'false');
      } else {
        element.setAttribute('is-novel', 'true');
      }
    });
  };

  const setUserNGButton = async () => {
    targetElements.forEach((element) => {
      const isNovel = element.getAttribute('is-novel');
      if (isNovel === 'false') {
        element.parentElement?.append(createUserBlockButton());
      } else {
        element.append(createUserBlockButton());
      }
    });
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
      element.closest('span')?.append(createTagBlockButton(tag));
    });
  };

  searchPage();
};
