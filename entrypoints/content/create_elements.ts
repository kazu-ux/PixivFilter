import { ChromeStorage } from '../utils/chrome_storage';

import { HideWorks } from './utils/hide_works';

export const createUserBlockButton = () => {
  const addButtonElement = document.createElement('span');
  addButtonElement.className = 'pf-user-ng-button';
  addButtonElement.setAttribute('data-type', 'add');

  addButtonElement.textContent = '[+]';

  addButtonElement.onclick = async (event) => {
    const userElement = (
      event.target as HTMLElement
    ).parentElement?.querySelector('[href*="users"]');
    const userId = userElement?.getAttribute('data-gtm-value');
    const userName =
      userElement?.children[0]?.getAttribute('title') ??
      userElement?.textContent;

    if (!userName || !userId) return;

    await ChromeStorage.setBlockUser({ userId, userName });
    await HideWorks.user(userId);
  };
  return addButtonElement;
};

export const createTagBlockButton = (tag: string) => {
  const spanElementTagNgButton = document.createElement('span');
  spanElementTagNgButton.className = 'pf-tag-ng-button';
  spanElementTagNgButton.setAttribute('data-type', 'add');
  spanElementTagNgButton.setAttribute('data-tag-name', tag);
  spanElementTagNgButton.textContent = '[+]';
  spanElementTagNgButton.onclick = async (event) => {
    await ChromeStorage.addBlockTag(tag);
    await HideWorks.tag(tag);
  };
  return spanElementTagNgButton;
};

export const createTagContainer = (worksTags: string[]) => {
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

    const spanElementTagNgButton = createTagBlockButton(tag);

    pElement.appendChild(aElement);
    pElement.appendChild(spanElementTagNgButton);

    divElement.appendChild(pElement);
  });
  return divElement;
};

export const createTagToggleButton = async () => {
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
