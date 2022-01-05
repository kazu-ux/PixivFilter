/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/deepmerge-ts/dist/node/index.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/deepmerge-ts/dist/node/index.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deepmerge": () => (/* binding */ deepmerge),
/* harmony export */   "deepmergeCustom": () => (/* binding */ deepmergeCustom)
/* harmony export */ });
/* harmony import */ var is_plain_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-plain-object */ "./node_modules/is-plain-object/dist/is-plain-object.mjs");


/**
 * Get the type of the given object.
 *
 * @param object - The object to get the type of.
 * @returns The type of the given object.
 */
function getObjectType(object) {
    if (typeof object !== "object" || object === null) {
        return 0 /* NOT */;
    }
    if (Array.isArray(object)) {
        return 2 /* ARRAY */;
    }
    if ((0,is_plain_object__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(object)) {
        return 1 /* RECORD */;
    }
    if (object instanceof Set) {
        return 3 /* SET */;
    }
    if (object instanceof Map) {
        return 4 /* MAP */;
    }
    return 5 /* OTHER */;
}
/**
 * Get the keys of the given objects including symbol keys.
 *
 * Note: Only keys to enumerable properties are returned.
 *
 * @param objects - An array of objects to get the keys of.
 * @returns A set containing all the keys of all the given objects.
 */
function getKeys(objects) {
    const keys = new Set();
    /* eslint-disable functional/no-loop-statement -- using a loop here is more efficient. */
    for (const object of objects) {
        for (const key of [
            ...Object.keys(object),
            ...Object.getOwnPropertySymbols(object),
        ]) {
            keys.add(key);
        }
    }
    /* eslint-enable functional/no-loop-statement */
    return keys;
}
/**
 * Does the given object have the given property.
 *
 * @param object - The object to test.
 * @param property - The property to test.
 * @returns Whether the object has the property.
 */
function objectHasProperty(object, property) {
    return (typeof object === "object" &&
        Object.prototype.propertyIsEnumerable.call(object, property));
}
/**
 * Get an iterable object that iterates over the given iterables.
 */
function getIterableOfIterables(iterables) {
    return {
        *[Symbol.iterator]() {
            // eslint-disable-next-line functional/no-loop-statement
            for (const iterable of iterables) {
                // eslint-disable-next-line functional/no-loop-statement
                for (const value of iterable) {
                    yield value;
                }
            }
        },
    };
}

const defaultOptions = {
    mergeMaps,
    mergeSets,
    mergeArrays,
    mergeRecords,
    mergeOthers: leaf,
};
/**
 * Deeply merge objects.
 *
 * @param objects - The objects to merge.
 */
function deepmerge(...objects) {
    return deepmergeCustom({})(...objects);
}
/**
 * Deeply merge two or more objects using the given options.
 *
 * @param options - The options on how to customize the merge function.
 */
function deepmergeCustom(options) {
    const utils = getUtils(options, customizedDeepmerge);
    /**
     * The customized deepmerge function.
     */
    function customizedDeepmerge(...objects) {
        if (objects.length === 0) {
            return undefined;
        }
        if (objects.length === 1) {
            return objects[0];
        }
        return mergeUnknowns(objects, utils);
    }
    return customizedDeepmerge;
}
/**
 * The the full options with defaults apply.
 *
 * @param options - The options the user specified
 */
function getUtils(options, customizedDeepmerge) {
    return {
        defaultMergeFunctions: defaultOptions,
        mergeFunctions: {
            ...defaultOptions,
            ...Object.fromEntries(Object.entries(options).map(([key, option]) => option === false ? [key, leaf] : [key, option])),
        },
        deepmerge: customizedDeepmerge,
    };
}
/**
 * Merge unknown things.
 *
 * @param values - The values.
 */
function mergeUnknowns(values, utils) {
    const type = getObjectType(values[0]);
    // eslint-disable-next-line functional/no-conditional-statement -- add an early escape for better performance.
    if (type !== 0 /* NOT */ && type !== 5 /* OTHER */) {
        // eslint-disable-next-line functional/no-loop-statement -- using a loop here is more performant than mapping every value and then testing every value.
        for (let mutableIndex = 1; mutableIndex < values.length; mutableIndex++) {
            if (getObjectType(values[mutableIndex]) === type) {
                continue;
            }
            return utils.mergeFunctions.mergeOthers(values, utils);
        }
    }
    switch (type) {
        case 1 /* RECORD */:
            return utils.mergeFunctions.mergeRecords(values, utils);
        case 2 /* ARRAY */:
            return utils.mergeFunctions.mergeArrays(values, utils);
        case 3 /* SET */:
            return utils.mergeFunctions.mergeSets(values, utils);
        case 4 /* MAP */:
            return utils.mergeFunctions.mergeMaps(values, utils);
        default:
            return utils.mergeFunctions.mergeOthers(values, utils);
    }
}
/**
 * Merge records.
 *
 * @param values - The records.
 */
function mergeRecords(values, utils) {
    const result = {};
    /* eslint-disable functional/no-loop-statement, functional/no-conditional-statement -- using a loop here is more performant. */
    for (const key of getKeys(values)) {
        const propValues = [];
        for (const value of values) {
            if (objectHasProperty(value, key)) {
                propValues.push(value[key]);
            }
        }
        // assert(propValues.length > 0);
        result[key] =
            propValues.length === 1
                ? propValues[0]
                : mergeUnknowns(propValues, utils);
    }
    /* eslint-enable functional/no-loop-statement, functional/no-conditional-statement */
    return result;
}
/**
 * Merge arrays.
 *
 * @param values - The arrays.
 */
function mergeArrays(values, utils) {
    return values.flat();
}
/**
 * Merge sets.
 *
 * @param values - The sets.
 */
function mergeSets(values, utils) {
    return new Set(getIterableOfIterables(values));
}
/**
 * Merge maps.
 *
 * @param values - The maps.
 */
function mergeMaps(values, utils) {
    return new Map(getIterableOfIterables(values));
}
/**
 * Merge "other" things.
 *
 * @param values - The values.
 */
function leaf(values, utils) {
    return values[values.length - 1];
}




/***/ }),

/***/ "./node_modules/is-plain-object/dist/is-plain-object.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/is-plain-object/dist/is-plain-object.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject)
/* harmony export */ });
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}




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
/* harmony import */ var deepmerge_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! deepmerge-ts */ "./node_modules/deepmerge-ts/dist/node/index.mjs");

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
    const setSyncStorage = () => {
        chrome.storage.sync.set({
            tagName: ['tag'],
            userKey: [{ userId: '1111', userName: 'aaa' }],
        });
    };
    // setSyncStorage();
    const getLocalStorage = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(null, (result) => {
                resolve(result);
            });
        });
    };
    const merged = (0,deepmerge_ts__WEBPACK_IMPORTED_MODULE_0__.deepmerge)(await getSyncStorage(), await getLocalStorage());
    console.log(merged);
    const setLocalStorage = (NGObject) => {
        chrome.storage.local.set(NGObject);
    };
    const syncObject = await getSyncStorage();
    const localObject = await getLocalStorage();
    if (Object.keys(syncObject).length && !Object.keys(localObject).length) {
        setLocalStorage(merged);
    }
    else {
        return;
    }
});

})();

/******/ })()
;