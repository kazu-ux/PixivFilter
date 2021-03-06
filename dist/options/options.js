/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/options/options.ts ***!
  \********************************/

(async () => {
    const blockedUsers = chrome.i18n.getMessage('blockedUsers');
    const blockedTags = chrome.i18n.getMessage('blockedTags');
    const removeButton = chrome.i18n.getMessage('removeButton');
    //HTMLを生成
    const createHtml = () => new Promise(async (resolve) => {
        const setHTMLtext = (text, selector) => {
            const targetElements = document.querySelectorAll(selector);
            console.log(targetElements);
            targetElements.forEach((targetElement) => {
                targetElement.innerText = text;
            });
        };
        const users = await getUserForGoogleStorage();
        if (users) {
            setHTMLtext(blockedUsers, '.blocked-users');
            // NGユーザー数を表示する
            const userCount = users.length;
            document.querySelector('.user-count').textContent = `(${userCount})`;
            users.map((user) => {
                const userName = user.userName;
                const userId = user.userId;
                const optionElement = document.createElement('option');
                optionElement.textContent = userName;
                optionElement.value = userId;
                document.querySelector('.user-select').appendChild(optionElement);
            });
        }
        const tagList = await getTagFromChromeStorage();
        if (tagList) {
            setHTMLtext(blockedTags, '.blocked-tags');
            const fragment = document.createDocumentFragment();
            // NGタグ数を表示する
            const tagCount = tagList.length;
            document.querySelector('.tag-count').textContent = `(${tagCount})`;
            tagList.map((tag) => {
                const optionElement = document.createElement('option');
                optionElement.textContent = tag;
                optionElement.value = tag;
                fragment.appendChild(optionElement);
                return fragment;
            });
            document.querySelector('.tag-select').appendChild(fragment);
        }
        setHTMLtext(removeButton, '[name="remove"]');
        resolve();
    });
    const filePickerOptions = {
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
        const writeFIle = async (handle, content) => {
            // writableを作成
            const writable = await handle.createWritable();
            // コンテントを書き込む
            await writable.write(content);
            // ファイルを閉じる
            await writable.close();
        };
        // 保存しているNGリストを取得する
        const NGObject = await new Promise((resolve, reject) => {
            chrome.storage.local.get(null, (items) => {
                resolve(items);
            });
        });
        const exportButtonElement = document.querySelector('.export-button');
        exportButtonElement.onclick = async () => {
            try {
                const handle = await window.showSaveFilePicker(filePickerOptions);
                await writeFIle(handle, JSON.stringify(NGObject));
            }
            catch (error) {
                console.log(error);
            }
        };
    };
    // インポートエレメントを作成する
    const createImportElement = () => {
        const importButtonElement = document.querySelector('.import-button');
        importButtonElement.onclick = async () => {
            try {
                const handle = (await window.showOpenFilePicker(filePickerOptions))[0];
                const file = await handle.getFile();
                const text = await file.text();
                const NGObject = JSON.parse(text);
                if (Object.keys(NGObject).includes('tagName') &&
                    Object.keys(NGObject).includes('userKey')) {
                    setNGObjectInStorage(NGObject);
                }
                else {
                    alert('JSONファイルの書式が違います');
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        const setNGObjectInStorage = (NGObject) => {
            chrome.storage.local.set(NGObject, () => {
                location.reload();
                console.log('書き込み完了');
            });
        };
    };
    const getLocalStorage = (key) => new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (items) => {
            resolve(items);
        });
    });
    //Chromeストレージからユーザー情報を取得
    const getUserForGoogleStorage = async () => {
        const users = (await getLocalStorage('userKey')).userKey;
        console.log(users);
        return users;
    };
    //Chromeストレージからタグを取得
    const getTagFromChromeStorage = async () => {
        const tags = (await getLocalStorage('tagName')).tagName;
        console.log(tags);
        return tags;
    };
    //クリックイベント
    const clickEvent = async () => {
        document.addEventListener('click', (event) => {
            const userOptionsElement = document.querySelector('.user-select').options;
            const tagOptionsElement = document.querySelector('.tag-select').options;
            const clickTargetClassName = event.target.className;
            if (clickTargetClassName === 'user-remove-button') {
                const notSelectedUsers = Array.from(userOptionsElement).flatMap((option) => {
                    if (!option.selected) {
                        const userName = option.textContent ?? '';
                        const userId = option.getAttribute('value') ?? '';
                        return [{ userName, userId }];
                    }
                    else {
                        return [];
                    }
                });
                const usersObj = { userKey: notSelectedUsers };
                removeChromeStorage(usersObj);
            }
            else if (clickTargetClassName === 'tag-remove-button') {
                const selectedTags = Array.from(tagOptionsElement).flatMap((option) => {
                    if (!option.selected) {
                        return [option.getAttribute('value') ?? ''];
                    }
                    else {
                        return [];
                    }
                });
                const tagsObj = { tagName: selectedTags };
                removeChromeStorage(tagsObj);
            }
        });
    };
    //Chromeストレージから削除
    const removeChromeStorage = async (userOrTagObj) => {
        if (userOrTagObj.userKey) {
            chrome.storage.local.set({ userKey: userOrTagObj.userKey });
        }
        else if (userOrTagObj.tagName) {
            chrome.storage.local.set({ tagName: userOrTagObj.tagName });
        }
        location.reload();
    };
    const main = async () => {
        await createHtml();
        createExportElement();
        createImportElement();
        clickEvent();
    };
    main();
})();

/******/ })()
;