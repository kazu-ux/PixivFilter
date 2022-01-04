"use strict";
(() => {
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
        clickEvent();
    };
    main();
})();
