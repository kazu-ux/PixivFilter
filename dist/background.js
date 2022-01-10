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
    if (!pages) {
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
    }
    const newURL = new URL(url);
    newURL.searchParams.set('p', pages);
    const href = newURL.href;
    console.log(href);
    const json = await (await fetch(href)).json();
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
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fetch_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetch_api */ "./src/fetch_api.ts");

chrome.webRequest.onBeforeRequest.addListener((details) => {
    (async () => {
        const url = details.url;
        const tabId = details.tabId;
        const initiator = details.initiator;
        const searchTargets = [
            'https://www.pixiv.net/ajax/search/illustrations/',
            'https://www.pixiv.net/ajax/search/artworks/',
            'https://www.pixiv.net/ajax/search/manga/',
            'https://www.pixiv.net/ajax/search/top/',
        ];
        await Promise.all(searchTargets.map(async (searchTarget) => {
            if (url.includes(searchTarget) &&
                initiator === 'https://www.pixiv.net') {
                const worksData = await (0,_fetch_api__WEBPACK_IMPORTED_MODULE_0__.getRequest)(url);
                console.log(worksData);
                chrome.tabs.sendMessage(tabId, worksData);
            }
        }));
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

})();

/******/ })()
;