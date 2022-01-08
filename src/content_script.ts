(() => {
  type UserOrTagObj = {
    userKey?: { userName: string; userId: string }[];
    tagName?: string[];
  };

  //NG登録したユーザーのイラストを非表示
  const removeElement = (userOrTagObj: UserOrTagObj) =>
    new Promise<void>((resolve) => {
      if (userOrTagObj.userKey) {
        const users = userOrTagObj.userKey;
        users.map((user) => {
          const userId = user.userId;
          const targets = document.querySelectorAll(
            `[href="/users/${userId}"]`
          );
          if (targets) {
            Array.from(targets).map((target) => {
              target.closest('li')!.style.display = 'none';
            });
          }
        });
      } else if (userOrTagObj.tagName) {
        const tags = userOrTagObj.tagName;
        tags.map((tag) => {
          const targets = document.querySelectorAll(`[data-tag-name="${tag}"]`);
          if (targets) {
            Array.from(targets).map((target) => {
              target.closest('li')!.style.display = 'none';
            });
          }
        });
      }
      resolve();
    });

  //ユーザー名の隣にNG登録するボタンとタグ表示ボタンを設置
  const createAddButton = async (elements: NodeListOf<Element>) =>
    new Promise<void>(async (resolve, reject) => {
      await Promise.all(
        Array.from(elements).map(async (element, index) => {
          if (!element.parentElement!.nextElementSibling) {
            const wrapperElement = document.createElement('div');
            wrapperElement.style.display = 'flex';
            wrapperElement.style.width = '100%';

            const divElement = document.createElement('div');
            divElement.className = 'pf-add-button-and-toggle';

            //ユーザー登録ボタンを設置
            const spanElementAddButton = document.createElement('span');
            spanElementAddButton.className = 'pf-add-button';
            spanElementAddButton.textContent = '[+]';

            //矢印を設置
            const toggleElement = document.createElement('span');
            toggleElement.className = 'pf-illust-info-toggle';
            toggleElement.textContent = '▼';
            toggleElement.style.userSelect = 'none';

            divElement.appendChild(spanElementAddButton);
            divElement.appendChild(toggleElement);
            wrapperElement.appendChild(divElement);

            // トグルボタンをユーザーごとの右端に配置するため
            element.parentElement!.style.position = 'relative';

            element.after(wrapperElement);
            wrapperElement.prepend(element);
            return;
          }
        })
      );
      resolve();
    });

  // タグコンテナを設置する
  const setTagElement = async (
    elements: HTMLLIElement[],
    illustDatas: [{ illustId: string; tags: string[] }]
  ) => {
    const getTargetWorksTag = (worksId: string) => {
      return new Promise<string[]>((resolve, reject) => {
        illustDatas.forEach((data) => {
          if (data.illustId === worksId) {
            resolve(data.tags);
          }
        });
      });
    };

    elements.forEach(async (target, index) => {
      const worksId = target
        .querySelector('[data-gtm-value]')!
        .getAttribute('data-gtm-value');
      if (!worksId) {
        return;
      }

      const tags = await getTargetWorksTag(worksId);
      //タグコンテナを追加
      target.appendChild(await createTagContainer(tags));
    });
    return;
  };

  //タグコンテナを作成する
  const createTagContainer = async (illustTags: string[]) => {
    const divElement = document.createElement('div');
    divElement.className = 'pf-tag-container';
    divElement.style.display = 'none';

    illustTags.forEach((tag) => {
      const pElement = document.createElement('p');
      pElement.className = 'pf-illust-tag';

      const aElement = document.createElement('a');
      aElement.className = 'pf-illust-tag-link';
      aElement.target = '-blank';
      aElement.href = `https://www.pixiv.net/tags/${tag}`;
      aElement.textContent = tag;

      const spanElementTagNgButton = document.createElement('span');
      spanElementTagNgButton.className = 'pf-tag-ng-button';
      spanElementTagNgButton.setAttribute('data-type', 'add');
      spanElementTagNgButton.setAttribute('data-tag-name', tag);
      spanElementTagNgButton.textContent = '[+]';

      pElement.appendChild(aElement);
      pElement.appendChild(spanElementTagNgButton);

      divElement.appendChild(pElement);
    });
    return divElement;
  };

  //クリックイベント処理
  const clickEvent = (e: MouseEvent) => {
    e.stopPropagation();
    const targetElement = e.target as HTMLElement;

    const targetParent = targetElement
      .closest('li')
      ?.querySelector('.pf-tag-container')! as HTMLElement;

    if (!targetParent) {
      return;
    }
    // NGユーザーボタン
    if (targetElement.getAttribute('class') === 'pf-add-button') {
      const userName = (e.composedPath()[2] as HTMLElement)
        .querySelector('[title]')!
        .getAttribute('title')!;
      const userId = (e.composedPath()[2] as HTMLElement)
        .querySelector('[href]')!
        .getAttribute('href')!
        .slice(7);
      console.log(userName, userId);
      addChoromeStorage({ userName: userName, userId: userId });
      removeElement({ userKey: [{ userName: userName, userId: userId }] });
      return;
    }

    // タグトグルボタン
    if (
      targetElement.getAttribute('class') === 'pf-illust-info-toggle' &&
      targetParent.style.display === 'none'
    ) {
      targetElement.textContent = '▲';
      targetParent.style.display = '';
    } else if (
      targetElement.getAttribute('class') === 'pf-illust-info-toggle' &&
      targetParent.style.display === ''
    ) {
      targetElement.textContent = '▼';
      targetParent.style.display = 'none';
    }

    // NGタグボタン
    if (targetElement.getAttribute('class') === 'pf-tag-ng-button') {
      const tagName = targetElement.getAttribute('data-tag-name')!;
      addChoromeStorage({ tagName: tagName });
      removeElement({ tagName: [tagName] });
    }
  };

  type IllustDataDic = {
    userName?: string;
    userId?: string;
    tagName?: string;
  };

  //NG登録ボタンを押したらChromeストレージに保存する
  const addChoromeStorage = async (illustDataDic: IllustDataDic) => {
    if (illustDataDic.userName) {
      const users = await new Promise<any[]>((resolve) => {
        chrome.storage.local.get(['userKey'], (results) => {
          if (results.userKey) {
            resolve(results.userKey);
          } else {
            resolve([]);
          }
        });
      });
      //重複している場合は保存しない
      //userIdのみの配列を作成
      const userIds = users.map((result) => {
        return result.userId;
      });
      //クリックしたユーザーが保存されているかを確認
      if (!userIds.includes(illustDataDic.userId)) {
        users.push(illustDataDic);
      }

      chrome.storage.local.set({ userKey: users });
      chrome.storage.local.get(null, (results) => {
        console.log(results);
      });
    } else if (illustDataDic.tagName) {
      //保存してあるタグを取得
      const tags = await new Promise<any[]>((resolve) => {
        chrome.storage.local.get(['tagName'], (results) => {
          if (results.tagName) {
            resolve(results.tagName);
          } else {
            resolve([]);
          }
        });
      });
      tags.push(illustDataDic.tagName);

      //重複を削除
      const newTags = Array.from(new Set(tags));

      chrome.storage.local.set({ tagName: newTags });
      chrome.storage.local.get(null, (results) => {
        console.log(results);
      });
    }
  };

  //ローカルストレージに保存されているNGキーワードの作品を非表示にする
  const checkGoogleStorage = () =>
    chrome.storage.local.get(null, async (results) => {
      await removeElement({ userKey: results.userKey });
      await removeElement({ tagName: results.tagName });
    });

  document.addEventListener('click', clickEvent);

  const main = async (illustDatas: [{ illustId: string; tags: string[] }]) => {
    // 検索結果が0の場合は処理をしない
    if (!illustDatas.length) {
      return;
    }

    let count = 0;
    const interval = setInterval(async () => {
      count += 1;
      if (count === 30) {
        clearInterval(interval);
      }
      //要素が読み込まれるまで待機
      const monitoredElements = document.querySelectorAll(
        '[aria-haspopup=true]'
      );

      if (monitoredElements[0]) {
        clearInterval(interval);

        const workElements = Array.from(monitoredElements).flatMap(
          (element) => element.closest('li') ?? []
        );

        await createAddButton(monitoredElements);
        await setTagElement(workElements, illustDatas);
        // checkGoogleStorage();
      }
    }, 100);
  };

  chrome.runtime.onMessage.addListener((illustDatas = []) => {
    main(illustDatas);
  });
})();
