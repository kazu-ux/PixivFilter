type UserOrTagObj = {
  userKey?: [{ userName: string; userId: string }];
  tagName?: [string];
};

//NG登録したユーザーのイラストを非表示
const removeElement = (userOrTagObj: UserOrTagObj) =>
  new Promise<void>((resolve) => {
    if (userOrTagObj.userKey) {
      const userDatas = userOrTagObj.userKey;
      userDatas.map((userData) => {
        const userId = userData.userId;
        const targets = document.querySelectorAll(`[href="/users/${userId}"]`);
        if (targets) {
          Array.prototype.map.call(targets, (target) => {
            target.closest('li').style.display = 'none';
          });
        }
      });
    } else if (userOrTagObj.tagName) {
      const tags = userOrTagObj.tagName;
      tags.map((tag) => {
        const targets = document.querySelectorAll(`[data-tag-name="${tag}"]`);
        if (targets) {
          Array.prototype.map.call(targets, (target) => {
            target.closest('li').style.display = 'none';
          });
        }
      });
    }
    resolve();
  });

//ユーザー名の隣にNG登録するボタンとタグ表示ボタンを設置
const createAddButton = async (elements: HTMLCollectionOf<Element>) =>
  new Promise<void>(async (resolve, reject) => {
    await Promise.all(
      Array.from(elements).map(async (element, index) => {
        if (!element.parentElement!.nextElementSibling) {
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
          toggleElement.setAttribute('data-state', 'hide');
          toggleElement.style.userSelect = 'none';

          divElement.appendChild(spanElementAddButton);
          divElement.appendChild(toggleElement);

          const userContainerElement = element.parentElement!.parentElement!;

          // トグルボタンをユーザーごとの右端に配置するため
          userContainerElement.style.position = 'relative';
          userContainerElement.appendChild(divElement);
          return;
        }
      })
    );
    resolve();
  });

//タグを表示する
const createTagElement = async (illustDatas: [{ tags: string[] }]) =>
  new Promise<void>(async (resolve) => {
    const targets = document.getElementsByClassName('pf-add-button');

    await Promise.all(
      Array.prototype.map.call(targets, async (target, index) => {
        //タグコンテナを追加
        const tags = illustDatas[index].tags;
        target.parentElement.parentElement.parentElement.appendChild(
          await createTagContainer(tags)
        );
        return;
      })
    );
    resolve();
  });

//タグコンテナを作成する
const createTagContainer = (illustTags: string[]) =>
  new Promise(async (resolve) => {
    const divElement = document.createElement('div');
    divElement.className = 'pf-tag-container';
    divElement.style.display = 'none';

    const illustTagcontainers = await Promise.all(
      illustTags.map((illust_tag) => {
        const spanElementIllustTag = document.createElement('p');
        spanElementIllustTag.className = 'pf-illust-tag';

        const aElement = document.createElement('a');
        aElement.className = 'pf-illust-tag-link';
        aElement.target = '-blank';
        aElement.href = `https://www.pixiv.net/tags/${illust_tag}`;
        aElement.textContent = illust_tag;

        const spanElementTagNgButton = document.createElement('span');
        spanElementTagNgButton.className = 'pf-tag-ng-button';
        spanElementTagNgButton.setAttribute('data-type', 'add');
        spanElementTagNgButton.setAttribute('data-tag-name', illust_tag);
        spanElementTagNgButton.textContent = '[+]';

        spanElementIllustTag.appendChild(aElement);
        spanElementIllustTag.appendChild(spanElementTagNgButton);

        divElement.appendChild(spanElementIllustTag);

        // divElement.appendChild(divElement);

        return divElement;
      })
    );
    resolve(illustTagcontainers[illustTagcontainers.length - 1]);
  });

//クリックイベント処理
const clickEvent = (e: MouseEvent) => {
  e.stopPropagation();
  const targetElement = e.target as HTMLElement;
  console.log(e);

  const targetParent = targetElement
    .closest('li')
    ?.querySelector('.pf-tag-container')! as HTMLElement;

  /*   if (targetElement.getAttribute('class') === 'pf-add-button') {
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
  } else */ if (
    targetElement.getAttribute('class') === 'pf-illust-info-toggle' &&
    targetElement.dataset.state === 'hide'
  ) {
    targetElement.textContent = '▲';
    targetElement.dataset.state = 'show';
    targetParent.style.display = '';
  } else if (
    targetElement.getAttribute('class') === 'pf-illust-info-toggle' &&
    targetElement.dataset.state === 'show'
  ) {
    targetElement.textContent = '▼';
    targetElement.dataset.state = 'hide';
    targetParent.style.display = 'none';
  }
  /* if (targetElement.getAttribute('class') === 'pf-tag-ng-button') {
    const tagName = targetElement.getAttribute('data-tag-name')!;
    addChoromeStorage({ tagName: tagName });
    removeElement({ tagName: [tagName] });
  } */
};

type IllustDataDic = {
  userName?: string;
  userId?: string;
  tagName?: string;
};

//NG登録ボタンを押したらChromeストレージに保存する
const addChoromeStorage = async (illustDataDic: IllustDataDic) => {
  if (illustDataDic.userName) {
    const userDatas = await new Promise<any[]>((resolve) => {
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
    const userIds = userDatas.map((result) => {
      return result.userId;
    });
    //クリックしたユーザーが保存されているかを確認
    if (!userIds.includes(illustDataDic.userId)) {
      userDatas.push(illustDataDic);
    }

    chrome.storage.local.set({ userKey: userDatas });
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

//ChromeストレージにNGユーザーが登録されているかを確認
const checkGoogleStorage = () =>
  new Promise<void>((resolve) => {
    chrome.storage.local.get(null, async (results) => {
      await removeElement({ userKey: results.userKey });
      await removeElement({ tagName: results.tagName });
      resolve();
    });
  });

document.addEventListener('click', clickEvent);

const main = async (illustDatas: [{ tags: string[] }]) => {
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
    const elements = document.getElementsByClassName('sc-1rx6dmq-2');

    if (elements[0]) {
      clearInterval(interval);
      await createAddButton(elements);
      await createTagElement(illustDatas);
      await checkGoogleStorage();
    }
  }, 100);
};

chrome.runtime.onMessage.addListener((illustDatas = []) => {
  main(illustDatas);
});
