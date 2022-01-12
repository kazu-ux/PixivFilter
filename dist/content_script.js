/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/fetch_api.ts":
/*!**************************!*\
  !*** ./src/fetch_api.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRequest": () => (/* binding */ getRequest)
/* harmony export */ });
const getRequest = async (url, pages) => {
    const getWorksData = (json) => {
        let worksData = [];
        try {
            worksData = worksData.concat(json.body.illustManga.data, json.body.popular.permanent, json.body.popular.recent);
        }
        catch (error) { }
        try {
            worksData = json.body.illust.data;
        }
        catch (error) { }
        try {
            worksData = json.body.manga.data;
        }
        catch (error) { }
        return worksData;
    };
    const getJson = async (url) => {
        const json = await (await fetch(url)).json();
        const worksData = getWorksData(json)
            .filter(Boolean)
            .flatMap((data) => {
            if (Object.keys(data).includes('isAdContainer')) {
                return [];
            }
            return [data];
        });
        return worksData;
    };
    if (!pages) {
        return await getJson(url);
    }
    const newURL = new URL(url);
    newURL.searchParams.set('p', pages);
    const href = newURL.href;
    console.log(href);
    return await getJson(href);
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/content_script.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fetch_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetch_api */ "./src/fetch_api.ts");

(() => {
    //NG登録したユーザーのイラストを非表示
    const removeElement = (userOrTagObj) => new Promise((resolve) => {
        if (userOrTagObj.userKey) {
            const users = userOrTagObj.userKey;
            users.forEach((user) => {
                const userId = user.userId;
                const targets = document.querySelectorAll(`[href="/users/${userId}"]`);
                if (targets) {
                    targets.forEach((target) => {
                        target.closest('li').style.display = 'none';
                    });
                }
            });
        }
        else if (userOrTagObj.tagName) {
            const tags = userOrTagObj.tagName;
            tags.forEach((tag) => {
                const targets = document.querySelectorAll(`[data-tag-name="${tag}"]`);
                if (targets) {
                    targets.forEach((target) => {
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
                const wrapperElement = document.createElement('div');
                wrapperElement.style.display = 'flex';
                wrapperElement.style.width = '100%';
                //ユーザー登録ボタンを設置
                const spanElementAddButton = document.createElement('span');
                spanElementAddButton.className = 'pf-user-add-button';
                spanElementAddButton.textContent = '[+]';
                //矢印を設置
                const toggleElement = document.createElement('span');
                toggleElement.className = 'pf-illust-info-toggle';
                toggleElement.textContent = '▼';
                toggleElement.style.userSelect = 'none';
                wrapperElement.appendChild(spanElementAddButton);
                wrapperElement.appendChild(toggleElement);
                // トグルボタンをユーザーごとの右端に配置するため
                element.parentElement.style.position = 'relative';
                element.after(wrapperElement);
                wrapperElement.prepend(element);
                return;
            }
        }));
        resolve();
    });
    // タグコンテナを設置する
    const setTagElement = async (elements, worksData) => {
        const getTargetWorksTag = (worksId) => {
            return new Promise((resolve, reject) => {
                worksData.forEach((data) => {
                    if (data.id === worksId) {
                        resolve(data.tags);
                    }
                });
            });
        };
        elements.forEach(async (target) => {
            const worksId = target
                .querySelector('[data-gtm-value]')
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
        // ユーザーNGボタン
        if (targetElement.getAttribute('class') === 'pf-user-add-button') {
            const userName = e.composedPath()[1].firstElementChild
                ?.textContent;
            const userId = e.composedPath()[1]
                .querySelector('[href]')
                .getAttribute('href')
                .slice(7);
            console.log(userName, userId);
            addChoromeStorage({ userName: userName, userId: userId });
            removeElement({ userKey: [{ userName: userName, userId: userId }] });
            return;
        }
        if (!targetParent) {
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
        // タグNGボタン
        if (targetElement.getAttribute('class') === 'pf-tag-ng-button') {
            const tagName = targetElement.getAttribute('data-tag-name');
            addChoromeStorage({ tagName: tagName });
            removeElement({ tagName: [tagName] });
        }
    };
    //NG登録ボタンを押したらChromeストレージに保存する
    const addChoromeStorage = async (clickedWorksData) => {
        const keys = Object.keys(clickedWorksData);
        // ユーザーの場合
        if ('userId' in clickedWorksData) {
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
            const userIds = users.map((result) => result.userId);
            //クリックしたユーザーが保存されているかを確認
            if (userIds.includes(clickedWorksData.userId)) {
                return;
            }
            users.push(clickedWorksData);
            chrome.storage.local.set({ userKey: users });
            return;
        }
        // タグの場合
        if ('tagName' in clickedWorksData) {
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
            tags.push(clickedWorksData.tagName);
            //重複を削除
            const newTags = Array.from(new Set(tags));
            chrome.storage.local.set({ tagName: newTags });
            return;
        }
    };
    //ローカルストレージに保存されているNGキーワードの作品を非表示にする
    const checkGoogleStorage = () => chrome.storage.local.get(null, async (results) => {
        await removeElement({ userKey: results.userKey });
        await removeElement({ tagName: results.tagName });
    });
    const createCloneElement = (workElement, worksDatum) => {
        const cloneElement = workElement.cloneNode(true);
        cloneElement.querySelector('button')?.remove();
        cloneElement.querySelector('.pf-tag-container')?.remove();
        const nodeElements = cloneElement.querySelectorAll('li>div>div');
        // サムネイル画像とURLを変更
        nodeElements[0].querySelector('img')?.setAttribute('src', worksDatum.url);
        nodeElements[0]
            .querySelector('a')
            ?.setAttribute('href', `/artworks/${worksDatum.id}`);
        //
        // タイトルとURLを変更
        nodeElements[1]
            .querySelector('a')
            ?.setAttribute('href', `/artworks/${worksDatum.id}`);
        nodeElements[1].querySelector('a').textContent = worksDatum.title;
        //
        // ユーザーアイコンを変更
        nodeElements[2]
            .querySelectorAll('a')[0]
            ?.setAttribute('href', `/users/${worksDatum.userId}`);
        nodeElements[2]
            .querySelector('img')
            ?.setAttribute('src', worksDatum.profileImageUrl);
        //
        // ユーザー名を変更
        nodeElements[2].querySelectorAll('a')[1].textContent = worksDatum.userName;
        nodeElements[2]
            .querySelectorAll('a')[1]
            .setAttribute('href', `/users/${worksDatum.userId}`);
        //
        return Promise.resolve(cloneElement);
        // workElement.parentElement?.prepend(cloneElement);
    };
    const setCloneElement = (workElement, worksData) => {
        worksData.forEach(async (worksDatum) => {
            const target = workElement.parentElement;
            target?.appendChild(await createCloneElement(workElement, worksDatum));
        });
    };
    document.addEventListener('click', clickEvent);
    const main = async (url, worksData) => {
        // console.log(worksData);
        // 検索結果が0の場合は処理をしない
        if (!worksData.length) {
            return;
        }
        let count = 0;
        const interval = setInterval(async () => {
            count += 1;
            if (count === 30) {
                clearInterval(interval);
            }
            //要素が読み込まれるまで待機
            const monitoredElements = document.querySelectorAll('[aria-haspopup=true]');
            if (monitoredElements[0]) {
                clearInterval(interval);
                const workElements = Array.from(monitoredElements).flatMap((element) => element.closest('li') ?? []);
                await createAddButton(monitoredElements);
                await setTagElement(workElements, worksData);
                checkGoogleStorage();
                // fetch
                const nextPageWorksData = await new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        const worksData = await (0,_fetch_api__WEBPACK_IMPORTED_MODULE_0__.getRequest)(url, '2');
                        console.log(worksData);
                        resolve(worksData);
                    }, 1000);
                });
                console.log('trueにする');
                await chrome.storage.local.set({ state: true });
                await setCloneElement(workElements[0], nextPageWorksData);
            }
        }, 100);
    };
    chrome.runtime.onMessage.addListener((message) => {
        main(message.url, message.worksData);
    });
})();

})();

/******/ })()
;