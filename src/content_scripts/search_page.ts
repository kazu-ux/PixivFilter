import { ChromeStorage } from '../database/chrome_storage';
import '../css/style.css';

export const SearchPage = () => {
  const getUserElements = () => {
    const targetElements = document.querySelectorAll<HTMLLinkElement>(
      'ul [href^="/users/"]'
    );
    if (!targetElements) return [];

    const userNameElements: HTMLLinkElement[] = Array.from(
      targetElements
    ).flatMap((element) => {
      if (!element.textContent) return [];
      return element;
    });

    return userNameElements;
  };
  async function searchPage() {
    console.log('content_script');

    /*  await setTagContainer();
    setNGButtonTagNovel(); */
    /*   const ngUsers = await ChromeStorage.getUser();
    ngUsers.forEach((user) => {
      hideNGUserWorks(user.userId);
    });

    const ngTags = await ChromeStorage.getTags();
    ngTags.forEach((tag) => {
      hideNGTagWorks(tag);
    }); */

    const setPFWorkTag = () => {
      const children = document.querySelectorAll('ul > *');

      children.forEach((element) => {
        if (element.classList.contains('pf-work')) return;
        element.classList.add('pf-work');
        const userElement = element.querySelector('[aria-haspopup]');
        if (!userElement) return;
        if (userElement.classList.contains('pf-userElement')) return;

        userElement.classList.add('pf-userElement');
      });
    };

    const intervalEvent = () => {
      const createBlockUserAddButton = (left: number, top: number) => {
        const onClick = async (event: MouseEvent) => {
          const userElement = (
            event.target as HTMLElement
          ).parentElement?.querySelector('[href*="users"]');
          const userId = userElement?.getAttribute('data-gtm-value') ?? '';
          const userName =
            userElement?.children[0]?.getAttribute('title') ??
            userElement?.textContent ??
            '';

          await ChromeStorage.setBlockUser({ userId, userName });
          // hideNGUserWorks(userId);
          console.log(userId, userName);
          console.log(userElement);
        };

        const addButtonElement = document.createElement('div');
        addButtonElement.className = 'pf-user-ng-button';
        addButtonElement.setAttribute('data-type', 'add');
        addButtonElement.textContent = '[+]';
        // addButtonElement.style.left = `${left}px`;
        addButtonElement.style.top = `${top}px`;

        addButtonElement.onclick = onClick;
        return addButtonElement;
      };

      const createTagToggleButton = (top: number) => {
        const onClick = (event: MouseEvent) => {
          const selectedTagContainer = (event.target as HTMLElement)
            .closest('.pf-work')
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

        const toggleButtonElement = document.createElement('div');
        toggleButtonElement.className = 'pf-tag-toggle-button';
        toggleButtonElement.textContent = '▼';

        toggleButtonElement.style.top = `${top}px`;
        toggleButtonElement.onclick = onClick;
        return toggleButtonElement;
      };

      const createTagNGButton = (tag: string) => {
        const onClick = async (event: MouseEvent) => {
          console.log(event.target);
          /*   await ChromeStorage.setTag(tag);
          hideNGTagWorks(tag); */
          return;
        };

        const spanElementTagNgButton = document.createElement('div');
        spanElementTagNgButton.className = 'pf-tag-ng-button';
        spanElementTagNgButton.setAttribute('data-type', 'add');
        spanElementTagNgButton.setAttribute('data-tag-name', tag);
        spanElementTagNgButton.textContent = '[+]';
        spanElementTagNgButton.onclick = onClick;
        return spanElementTagNgButton;
      };

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

      setInterval(() => {
        setPFWorkTag();
        getUserElements().forEach(async (element) => {
          if (!element) return;

          const workId = element
            .closest('.pf-work')
            ?.querySelector('[width] [data-gtm-value]')
            ?.getAttribute('data-gtm-value');
          if (!workId) return;

          const left = element.offsetLeft;
          const top = element.offsetTop;
          const width = element.offsetWidth;
          if (!(left | top | width)) return;

          if (
            element
              .closest('[aria-haspopup]')
              ?.parentElement?.querySelector('.pf-user-ng-button')
          )
            return;
          element
            .closest('[aria-haspopup]')
            ?.after(
              createBlockUserAddButton(
                element.offsetLeft + element.offsetWidth,
                top
              )
            );

          element.closest('[aria-haspopup]')?.after(createTagToggleButton(top));

          element
            .closest('.pf-work')
            ?.append(
              createTagContainer(await ChromeStorage.getWorkTags(workId))
            );
        });
        console.log('interval');
      }, 1000);
    };
    intervalEvent();
  }

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

  /*   const setNGButtonTagNovel = () => {
    const aElements = document.querySelectorAll(
      '.gtm-novel-searchpage-result-tag'
    );

    aElements.forEach((element) => {
      const tag = element.getAttribute('data-gtm-label');
      if (!tag) return;
      element.closest('span')?.append(createTagNGButton(tag));
    });
  }; */

  searchPage();
  return;
};
