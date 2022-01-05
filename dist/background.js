/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

let count = 0;
chrome.webRequest.onBeforeRequest.addListener((e) => {
    (async () => {
        const url = e.url;
        const tabId = e.tabId;
        const searchTargets = [
            'https://www.pixiv.net/ajax/search/illustrations/',
            'https://www.pixiv.net/ajax/search/artworks/',
            'https://www.pixiv.net/ajax/search/manga/',
            'https://www.pixiv.net/ajax/search/top/',
        ];
        await Promise.all(searchTargets.map(async (searchTarget) => {
            if (url.includes(searchTarget) && count === 0) {
                count += 1;
                console.log(count);
                const json = await fetch(url).then((res) => {
                    return res.json();
                });
                console.log(json);
                let illustDatas = [];
                if (searchTarget === 'https://www.pixiv.net/ajax/search/artworks/' ||
                    searchTarget === 'https://www.pixiv.net/ajax/search/top/') {
                    illustDatas = json.body.illustManga.data;
                }
                else if (searchTarget ===
                    'https://www.pixiv.net/ajax/search/illustrations/') {
                    illustDatas = json.body.illust.data;
                }
                else if (searchTarget === 'https://www.pixiv.net/ajax/search/manga/') {
                    illustDatas = json.body.manga.data;
                }
                illustDatas = await Promise.all(illustDatas.map((illustData) => {
                    const illustId = illustData.id;
                    const tags = illustData.tags;
                    if (illustId) {
                        return { illustId: illustId, tags: tags };
                    }
                }));
                illustDatas = illustDatas.filter((n) => {
                    return n != undefined;
                });
                console.log(illustDatas);
                chrome.tabs.sendMessage(tabId, illustDatas);
            }
        }));
        count = 0;
    })();
}, { urls: ['*://www.pixiv.net/*'] }, ['requestBody', 'blocking']);
chrome.runtime.onInstalled.addListener(async () => {
    console.log('test');
    const getSyncStorage = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (result) => {
                resolve(result);
            });
        });
    };
    /* const setSyncStorage = () => {
      chrome.storage.sync.set({
        tagName: ['tag'],
        userKey: [{ userId: '1111', userName: 'aaa' }],
      });
    };
    // setSyncStorage(); */
    const getLocalStorage = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(null, (result) => {
                resolve(result);
            });
        });
    };
    const setLocalStorage = (NGObject) => {
        chrome.storage.local.set(NGObject);
    };
    const syncObject = await getSyncStorage();
    const localObject = await getLocalStorage();
    if (Object.keys(syncObject).length && !Object.keys(localObject).length) {
        setLocalStorage(syncObject);
    }
    else {
        return;
    }
});

/******/ })()
;