/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/***/ (() => {

eval("\r\nconst getTabId = () => new Promise((resolve, reject) => {\r\n    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {\r\n        const tabId = tab[0].id;\r\n        if (!tabId) {\r\n            return;\r\n        }\r\n        console.log(tabId);\r\n        resolve(tabId);\r\n    });\r\n});\r\nlet count = 0;\r\nchrome.webRequest.onBeforeRequest.addListener((e) => {\r\n    (async () => {\r\n        const url = e.url;\r\n        const searchTargets = [\r\n            'https://www.pixiv.net/ajax/search/illustrations/',\r\n            'https://www.pixiv.net/ajax/search/artworks/',\r\n            'https://www.pixiv.net/ajax/search/manga/',\r\n            'https://www.pixiv.net/ajax/search/top/',\r\n        ];\r\n        await Promise.all(searchTargets.map(async (searchTarget) => {\r\n            if (url.includes(searchTarget) && count === 0) {\r\n                count += 1;\r\n                console.log(count);\r\n                const json = await fetch(url).then((res) => {\r\n                    return res.json();\r\n                });\r\n                console.log(json);\r\n                let illustDatas = [];\r\n                if (searchTarget === 'https://www.pixiv.net/ajax/search/artworks/' ||\r\n                    searchTarget === 'https://www.pixiv.net/ajax/search/top/') {\r\n                    illustDatas = json.body.illustManga.data;\r\n                }\r\n                else if (searchTarget ===\r\n                    'https://www.pixiv.net/ajax/search/illustrations/') {\r\n                    illustDatas = json.body.illust.data;\r\n                }\r\n                else if (searchTarget === 'https://www.pixiv.net/ajax/search/manga/') {\r\n                    illustDatas = json.body.manga.data;\r\n                }\r\n                illustDatas = await Promise.all(illustDatas.map((illustData) => {\r\n                    const illustId = illustData.id;\r\n                    const tags = illustData.tags;\r\n                    if (illustId) {\r\n                        return { illustId: illustId, tags: tags };\r\n                    }\r\n                }));\r\n                illustDatas = illustDatas.filter((n) => {\r\n                    return n != undefined;\r\n                });\r\n                console.log(illustDatas);\r\n                chrome.tabs.sendMessage(await getTabId(), illustDatas);\r\n            }\r\n        }));\r\n        count = 0;\r\n    })();\r\n}, { urls: ['*://www.pixiv.net/*'] }, ['requestBody', 'blocking']);\r\n(async () => {\r\n    console.log('test');\r\n    const getSyncStorage = () => {\r\n        return new Promise((resolve, reject) => {\r\n            chrome.storage.sync.get(null, (result) => {\r\n                resolve(result);\r\n            });\r\n        });\r\n    };\r\n    const getLocalStorage = () => {\r\n        return new Promise((resolve, reject) => {\r\n            chrome.storage.local.get(null, (result) => {\r\n                resolve(result);\r\n            });\r\n        });\r\n    };\r\n    const setLocalStorage = (syncObject) => {\r\n        chrome.storage.local.set(syncObject);\r\n    };\r\n    const SyncObject = await getSyncStorage();\r\n    if (Object.keys(SyncObject).length) {\r\n        // setLocalStorage(SyncObject);\r\n    }\r\n    else {\r\n        return;\r\n    }\r\n})();\r\n\n\n//# sourceURL=webpack://pixiv-filter-v2/./src/background.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background.ts"]();
/******/ 	
/******/ })()
;