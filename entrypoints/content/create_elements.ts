import { ChromeStorage } from '../utils/chrome_storage';
import { hideNGTagWorks, hideNGUserWorks } from './search_page';

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
    hideNGUserWorks(userId);
    console.log(userId, userName);
    console.log(userElement);
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
    console.log(event.target);
    await ChromeStorage.addBlockTag(tag);
    hideNGTagWorks(tag);
    return;
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
