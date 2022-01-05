/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/options/options.ts ***!
  \********************************/

(async () => {
    //HTMLを生成
    const createHtml = () => new Promise(async (resolve) => {
        const users = await getUserForGoogleStorage();
        // NGユーザー数を表示する
        const userCount = users.length;
        document.querySelector('.user-count').textContent = `(${userCount})`;
        users.map((userDic) => {
            const userName = userDic.userName;
            const userId = userDic.userId;
            const optionElement = document.createElement('option');
            optionElement.textContent = userName;
            optionElement.value = userId;
            document.querySelector('.user-select').appendChild(optionElement);
        });
        const fragment = document.createDocumentFragment();
        const tagList = await getTagFromChromeStorage();
        // NGタグ数を表示する
        const tagCount = tagList.length;
        document.querySelector('.tag-count').textContent = `(${tagCount})`;
        await Promise.all(tagList.map((tag) => {
            const optionElement = document.createElement('option');
            optionElement.textContent = tag;
            optionElement.value = tag;
            fragment.appendChild(optionElement);
            return fragment;
        }));
        document.querySelector('.tag-select').appendChild(fragment);
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
                    alert('ファイルの書式が違います');
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        const setNGObjectInStorage = (NGObject) => {
            chrome.storage.local.set(NGObject, () => {
                console.log('書き込み完了');
            });
        };
    };
    //Chromeストレージからユーザー情報を取得
    const getUserForGoogleStorage = () => new Promise((resolve) => {
        chrome.storage.local.get(['userKey'], (results = {}) => {
            if (Object.keys(results).length === 0) {
                resolve([]);
            }
            else {
                const user = results.userKey;
                resolve(user);
            }
        });
    });
    //Chromeストレージから保存してあるタグを取得
    const getTagFromChromeStorage = () => new Promise((resolve) => {
        chrome.storage.local.get(['tagName'], (results) => {
            if (results.tagName) {
                resolve(results.tagName);
            }
            else {
                resolve([]);
            }
        });
    });
    //クリックイベント
    const clickEvent = async () => {
        const removeButton = document.querySelectorAll("[name='remove']");
        await Promise.all(Array.prototype.map.call(removeButton, (element) => {
            element.addEventListener('click', async (e) => {
                const className = e.target.getAttribute('class');
                if (className === 'user-remove-button') {
                    const options = document.querySelector('.user-select').options;
                    const selectedUsers = Array.prototype.map
                        .call(options, (option) => {
                        if (!option.selected) {
                            const userName = option.textContent;
                            const userId = option.getAttribute('value');
                            console.log(option.getAttribute('value'));
                            return { userName: userName, userId: userId };
                        }
                    })
                        .filter((n) => {
                        return n != undefined;
                    });
                    const usersObj = { userDatas: selectedUsers };
                    console.log(usersObj);
                    removeChromeStorage(usersObj);
                }
                else if (className === 'tag-remove-button') {
                    const options = document.querySelector('.tag-select').options;
                    const selectedTags = Array.prototype.map
                        .call(options, (option) => {
                        if (!option.selected) {
                            return option.getAttribute('value');
                        }
                    })
                        .filter((n) => {
                        return n != undefined;
                    });
                    const tagsObj = { tagNames: selectedTags };
                    console.log(tagsObj);
                    removeChromeStorage(tagsObj);
                }
            });
            return;
        }));
    };
    //Chromeストレージから削除
    const removeChromeStorage = async (userOrTagObj) => {
        console.log(userOrTagObj);
        if (userOrTagObj.userDatas) {
            chrome.storage.local.set({ userKey: userOrTagObj.userDatas });
        }
        else if (userOrTagObj.tagNames) {
            chrome.storage.local.set({ tagName: userOrTagObj.tagNames });
        }
        location.reload();
    };
    const main = async () => {
        await createHtml();
        await createExportElement();
        await createImportElement();
        clickEvent();
    };
    main();
})();

/******/ })()
;