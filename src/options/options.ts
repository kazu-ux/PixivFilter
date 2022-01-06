(async () => {
  //HTMLを生成
  const createHtml = () =>
    new Promise<void>(async (resolve) => {
      const users = await getUserForGoogleStorage();

      // NGユーザー数を表示する
      const userCount = users.length;
      document.querySelector('.user-count')!.textContent = `(${userCount})`;

      users.map((userDic) => {
        const userName = userDic.userName;
        const userId = userDic.userId;
        const optionElement = document.createElement('option');
        optionElement.textContent = userName;
        optionElement.value = userId;
        document.querySelector('.user-select')!.appendChild(optionElement);
      });

      const fragment = document.createDocumentFragment();

      const tagList = await getTagFromChromeStorage();

      // NGタグ数を表示する
      const tagCount = tagList.length;
      document.querySelector('.tag-count')!.textContent = `(${tagCount})`;

      await Promise.all(
        tagList.map((tag) => {
          const optionElement = document.createElement('option');
          optionElement.textContent = tag;
          optionElement.value = tag;
          fragment.appendChild(optionElement);
          return fragment;
        })
      );

      document.querySelector('.tag-select')!.appendChild(fragment);
      resolve();
    });

  const filePickerOptions: SaveFilePickerOptions = {
    suggestedName: 'pixiv_nglist',
    types: [
      {
        accept: {
          'application/json': ['.json'],
        },
      },
    ],
  };

  // エクスポートエレメントを作成する
  const createExportElement = async () => {
    // 書き込む関数
    const writeFIle = async (
      handle: FileSystemFileHandle,
      content: FileSystemWriteChunkType
    ) => {
      // writableを作成
      const writable = await handle.createWritable();

      // コンテントを書き込む
      await writable.write(content);

      // ファイルを閉じる
      await writable.close();
    };

    // 保存しているNGリストを取得する
    const NGObject = await new Promise<{ [key: string]: {}[] } | {}>(
      (resolve, reject) => {
        chrome.storage.local.get(null, (items: { [key: string]: {}[] }) => {
          resolve(items);
        });
      }
    );

    const exportButtonElement = document.querySelector(
      '.export-button'
    ) as HTMLElement;
    exportButtonElement.onclick = async () => {
      try {
        const handle = await window.showSaveFilePicker(filePickerOptions);
        await writeFIle(handle, JSON.stringify(NGObject));
      } catch (error) {
        console.log(error);
      }
    };
  };

  // インポートエレメントを作成する
  const createImportElement = () => {
    const importButtonElement = document.querySelector(
      '.import-button'
    ) as HTMLElement;

    importButtonElement.onclick = async () => {
      try {
        const handle = (await window.showOpenFilePicker(filePickerOptions))[0];
        const file = await handle.getFile();
        const text = await file.text();
        const NGObject = JSON.parse(text);
        if (
          Object.keys(NGObject).includes('tagName') &&
          Object.keys(NGObject).includes('userKey')
        ) {
          setNGObjectInStorage(NGObject);
        } else {
          alert('ファイルの書式が違います');
        }
      } catch (error) {
        console.log(error);
      }
    };

    const setNGObjectInStorage = (
      NGObject:
        | {}
        | {
            [key: string]: {}[];
          }
    ) => {
      chrome.storage.local.set(NGObject, () => {
        location.reload();
        console.log('書き込み完了');
      });
    };
  };

  //Chromeストレージからユーザー情報を取得
  const getUserForGoogleStorage = () =>
    new Promise<{ userName: string; userId: string }[]>((resolve) => {
      chrome.storage.local.get(['userKey'], (results = {}) => {
        if (Object.keys(results).length === 0) {
          resolve([]);
        } else {
          const user = results.userKey;

          resolve(user);
        }
      });
    });

  //Chromeストレージから保存してあるタグを取得
  const getTagFromChromeStorage = () =>
    new Promise<string[]>((resolve) => {
      chrome.storage.local.get(
        ['tagName'],
        (results: { [key: string]: string[] }) => {
          if (results.tagName) {
            resolve(results.tagName);
          } else {
            resolve([]);
          }
        }
      );
    });

  //クリックイベント
  const clickEvent = async () => {
    document.addEventListener('click', (event) => {
      const userOptionsElement = (
        document.querySelector('.user-select') as HTMLSelectElement
      ).options;

      const tagOptionsElement = (
        document.querySelector('.tag-select') as HTMLSelectElement
      ).options;

      const clickTargetClassName = (event.target as HTMLElement).className;

      if (clickTargetClassName === 'user-remove-button') {
        const notSelectedUsers = Array.from(userOptionsElement).flatMap(
          (option) => {
            if (!option.selected) {
              const userName = option.textContent;
              const userId = option.getAttribute('value');
              console.log(option.getAttribute('value'));
              return [{ userName, userId }];
            } else {
              return [];
            }
          }
        );

        console.log(notSelectedUsers);
        const usersObj = { userKey: notSelectedUsers };
        removeChromeStorage(usersObj);
      } else if (clickTargetClassName === 'tag-remove-button') {
        const selectedTags = Array.from(tagOptionsElement).flatMap((option) => {
          if (!option.selected) {
            return [option.getAttribute('value')];
          } else {
            return [];
          }
        });

        const tagsObj = { tagName: selectedTags };
        console.log(tagsObj);
        removeChromeStorage(tagsObj);
      }
    });

    const removeButton = document.querySelectorAll("[name='remove']");
  };

  type UserOrTagObj = {
    userKey?: { userName: string | null; userId: string | null }[];
    tagName?: (string | null)[];
  };

  //Chromeストレージから削除
  const removeChromeStorage = async (userOrTagObj: UserOrTagObj) => {
    console.log(userOrTagObj);
    if (userOrTagObj.userKey) {
      chrome.storage.local.set({ userKey: userOrTagObj.userKey });
    } else if (userOrTagObj.tagName) {
      chrome.storage.local.set({ tagName: userOrTagObj.tagName });
    }
    // location.reload();
  };

  const main = async () => {
    await createHtml();
    await createExportElement();
    await createImportElement();
    clickEvent();
  };

  main();
})();
