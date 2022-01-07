/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*******************************!*\
  !*** ./src/content_script.ts ***!
  \*******************************/

//NG登録したユーザーのイラストを非表示
const removeElement = (userOrTagObj) => new Promise((resolve) => {
    if (userOrTagObj.userKey) {
        const users = userOrTagObj.userKey;
        users.map((user) => {
            const userId = user.userId;
            const targets = document.querySelectorAll(`[href="/users/${userId}"]`);
            if (targets) {
                Array.from(targets).map((target) => {
                    target.closest('li').style.display = 'none';
                });
            }
        });
    }
    else if (userOrTagObj.tagName) {
        const tags = userOrTagObj.tagName;
        tags.map((tag) => {
            const targets = document.querySelectorAll(`[data-tag-name="${tag}"]`);
            if (targets) {
                Array.from(targets).map((target) => {
                    target.closest('li').style.display = 'none';
                });
            }
        });
    }
    resolve();
});
//ユーザー名の隣にNG登録するボタンとタグ表示ボタンを設置
const createAddButton = async (elements) => new Promise(async (resolve, reject) => {
    await Promise.all(Array.from(elements).map(async (element, index) => {
        if (!element.parentElement.nextElementSibling) {
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
            const userContainerElement = element.parentElement.parentElement;
            // トグルボタンをユーザーごとの右端に配置するため
            userContainerElement.style.position = 'relative';
            userContainerElement.appendChild(divElement);
            return;
        }
    }));
    resolve();
});
// タグコンテナを設置する
const setTagElement = async (illustDatas) => {
    const targetElements = document.querySelectorAll('.pf-add-button');
    targetElements.forEach(async (target, index) => {
        //タグコンテナを追加
        const tags = illustDatas[index].tags;
        target
            .closest('li')
            ?.firstElementChild.appendChild(await createTagContainer(tags));
    });
    return;
};
//タグコンテナを作成する
const createTagContainer = async (illustTags) => {
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
const clickEvent = (e) => {
    e.stopPropagation();
    const targetElement = e.target;
    const targetParent = targetElement
        .closest('li')
        ?.querySelector('.pf-tag-container');
    if (!targetParent) {
        return;
    }
    // NGユーザーボタン
    if (targetElement.getAttribute('class') === 'pf-add-button') {
        const userName = e.composedPath()[2]
            .querySelector('[title]')
            .getAttribute('title');
        const userId = e.composedPath()[2]
            .querySelector('[href]')
            .getAttribute('href')
            .slice(7);
        console.log(userName, userId);
        addChoromeStorage({ userName: userName, userId: userId });
        removeElement({ userKey: [{ userName: userName, userId: userId }] });
        return;
    }
    // タグトグルボタン
    if (targetElement.getAttribute('class') === 'pf-illust-info-toggle' &&
        targetParent.style.display === 'none') {
        targetElement.textContent = '▲';
        targetParent.style.display = '';
    }
    else if (targetElement.getAttribute('class') === 'pf-illust-info-toggle' &&
        targetParent.style.display === '') {
        targetElement.textContent = '▼';
        targetParent.style.display = 'none';
    }
    // NGタグボタン
    if (targetElement.getAttribute('class') === 'pf-tag-ng-button') {
        const tagName = targetElement.getAttribute('data-tag-name');
        addChoromeStorage({ tagName: tagName });
        removeElement({ tagName: [tagName] });
    }
};
//NG登録ボタンを押したらChromeストレージに保存する
const addChoromeStorage = async (illustDataDic) => {
    if (illustDataDic.userName) {
        const users = await new Promise((resolve) => {
            chrome.storage.local.get(['userKey'], (results) => {
                if (results.userKey) {
                    resolve(results.userKey);
                }
                else {
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
    }
    else if (illustDataDic.tagName) {
        //保存してあるタグを取得
        const tags = await new Promise((resolve) => {
            chrome.storage.local.get(['tagName'], (results) => {
                if (results.tagName) {
                    resolve(results.tagName);
                }
                else {
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
const checkGoogleStorage = () => new Promise((resolve) => {
    chrome.storage.local.get(null, async (results) => {
        await removeElement({ userKey: results.userKey });
        await removeElement({ tagName: results.tagName });
        resolve();
    });
});
document.addEventListener('click', clickEvent);
const main = async (illustDatas) => {
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
            await setTagElement(illustDatas);
            await checkGoogleStorage();
        }
    }, 100);
};
chrome.runtime.onMessage.addListener((illustDatas = []) => {
    main(illustDatas);
});

/******/ })()
;