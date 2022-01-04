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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var deepmerge_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! deepmerge-ts */ \"./node_modules/deepmerge-ts/dist/node/index.mjs\");\n\r\nconst getTabId = () => new Promise((resolve, reject) => {\r\n    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {\r\n        const tabId = tab[0].id;\r\n        if (!tabId) {\r\n            return;\r\n        }\r\n        console.log(tabId);\r\n        resolve(tabId);\r\n    });\r\n});\r\nlet count = 0;\r\nchrome.webRequest.onBeforeRequest.addListener((e) => {\r\n    (async () => {\r\n        const url = e.url;\r\n        const searchTargets = [\r\n            'https://www.pixiv.net/ajax/search/illustrations/',\r\n            'https://www.pixiv.net/ajax/search/artworks/',\r\n            'https://www.pixiv.net/ajax/search/manga/',\r\n            'https://www.pixiv.net/ajax/search/top/',\r\n        ];\r\n        await Promise.all(searchTargets.map(async (searchTarget) => {\r\n            if (url.includes(searchTarget) && count === 0) {\r\n                count += 1;\r\n                console.log(count);\r\n                const json = await fetch(url).then((res) => {\r\n                    return res.json();\r\n                });\r\n                console.log(json);\r\n                let illustDatas = [];\r\n                if (searchTarget === 'https://www.pixiv.net/ajax/search/artworks/' ||\r\n                    searchTarget === 'https://www.pixiv.net/ajax/search/top/') {\r\n                    illustDatas = json.body.illustManga.data;\r\n                }\r\n                else if (searchTarget ===\r\n                    'https://www.pixiv.net/ajax/search/illustrations/') {\r\n                    illustDatas = json.body.illust.data;\r\n                }\r\n                else if (searchTarget === 'https://www.pixiv.net/ajax/search/manga/') {\r\n                    illustDatas = json.body.manga.data;\r\n                }\r\n                illustDatas = await Promise.all(illustDatas.map((illustData) => {\r\n                    const illustId = illustData.id;\r\n                    const tags = illustData.tags;\r\n                    if (illustId) {\r\n                        return { illustId: illustId, tags: tags };\r\n                    }\r\n                }));\r\n                illustDatas = illustDatas.filter((n) => {\r\n                    return n != undefined;\r\n                });\r\n                console.log(illustDatas);\r\n                chrome.tabs.sendMessage(await getTabId(), illustDatas);\r\n            }\r\n        }));\r\n        count = 0;\r\n    })();\r\n}, { urls: ['*://www.pixiv.net/*'] }, ['requestBody', 'blocking']);\r\n(async () => {\r\n    console.log('test');\r\n    const getSyncStorage = () => {\r\n        return new Promise((resolve, reject) => {\r\n            chrome.storage.sync.get(null, (result) => {\r\n                resolve(result);\r\n            });\r\n        });\r\n    };\r\n    const getLocalStorage = () => {\r\n        return new Promise((resolve, reject) => {\r\n            chrome.storage.local.get(null, (result) => {\r\n                resolve(result);\r\n            });\r\n        });\r\n    };\r\n    const merged = (0,deepmerge_ts__WEBPACK_IMPORTED_MODULE_0__.deepmerge)(await getSyncStorage(), await getLocalStorage());\r\n    console.log(merged);\r\n    const setLocalStorage = (syncObject) => {\r\n        chrome.storage.local.set(syncObject);\r\n    };\r\n    const SyncObject = await getSyncStorage();\r\n    if (Object.keys(SyncObject).length) {\r\n        // setLocalStorage(SyncObject);\r\n    }\r\n    else {\r\n        return;\r\n    }\r\n})();\r\n\n\n//# sourceURL=webpack://pixiv-filter-v2/./src/background.ts?");

/***/ }),

/***/ "./node_modules/deepmerge-ts/dist/node/index.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/deepmerge-ts/dist/node/index.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"deepmerge\": () => (/* binding */ deepmerge),\n/* harmony export */   \"deepmergeCustom\": () => (/* binding */ deepmergeCustom)\n/* harmony export */ });\n/* harmony import */ var is_plain_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-plain-object */ \"./node_modules/is-plain-object/dist/is-plain-object.mjs\");\n\n\n/**\n * Get the type of the given object.\n *\n * @param object - The object to get the type of.\n * @returns The type of the given object.\n */\nfunction getObjectType(object) {\n    if (typeof object !== \"object\" || object === null) {\n        return 0 /* NOT */;\n    }\n    if (Array.isArray(object)) {\n        return 2 /* ARRAY */;\n    }\n    if ((0,is_plain_object__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(object)) {\n        return 1 /* RECORD */;\n    }\n    if (object instanceof Set) {\n        return 3 /* SET */;\n    }\n    if (object instanceof Map) {\n        return 4 /* MAP */;\n    }\n    return 5 /* OTHER */;\n}\n/**\n * Get the keys of the given objects including symbol keys.\n *\n * Note: Only keys to enumerable properties are returned.\n *\n * @param objects - An array of objects to get the keys of.\n * @returns A set containing all the keys of all the given objects.\n */\nfunction getKeys(objects) {\n    const keys = new Set();\n    /* eslint-disable functional/no-loop-statement -- using a loop here is more efficient. */\n    for (const object of objects) {\n        for (const key of [\n            ...Object.keys(object),\n            ...Object.getOwnPropertySymbols(object),\n        ]) {\n            keys.add(key);\n        }\n    }\n    /* eslint-enable functional/no-loop-statement */\n    return keys;\n}\n/**\n * Does the given object have the given property.\n *\n * @param object - The object to test.\n * @param property - The property to test.\n * @returns Whether the object has the property.\n */\nfunction objectHasProperty(object, property) {\n    return (typeof object === \"object\" &&\n        Object.prototype.propertyIsEnumerable.call(object, property));\n}\n/**\n * Get an iterable object that iterates over the given iterables.\n */\nfunction getIterableOfIterables(iterables) {\n    return {\n        *[Symbol.iterator]() {\n            // eslint-disable-next-line functional/no-loop-statement\n            for (const iterable of iterables) {\n                // eslint-disable-next-line functional/no-loop-statement\n                for (const value of iterable) {\n                    yield value;\n                }\n            }\n        },\n    };\n}\n\nconst defaultOptions = {\n    mergeMaps,\n    mergeSets,\n    mergeArrays,\n    mergeRecords,\n    mergeOthers: leaf,\n};\n/**\n * Deeply merge objects.\n *\n * @param objects - The objects to merge.\n */\nfunction deepmerge(...objects) {\n    return deepmergeCustom({})(...objects);\n}\n/**\n * Deeply merge two or more objects using the given options.\n *\n * @param options - The options on how to customize the merge function.\n */\nfunction deepmergeCustom(options) {\n    const utils = getUtils(options, customizedDeepmerge);\n    /**\n     * The customized deepmerge function.\n     */\n    function customizedDeepmerge(...objects) {\n        if (objects.length === 0) {\n            return undefined;\n        }\n        if (objects.length === 1) {\n            return objects[0];\n        }\n        return mergeUnknowns(objects, utils);\n    }\n    return customizedDeepmerge;\n}\n/**\n * The the full options with defaults apply.\n *\n * @param options - The options the user specified\n */\nfunction getUtils(options, customizedDeepmerge) {\n    return {\n        defaultMergeFunctions: defaultOptions,\n        mergeFunctions: {\n            ...defaultOptions,\n            ...Object.fromEntries(Object.entries(options).map(([key, option]) => option === false ? [key, leaf] : [key, option])),\n        },\n        deepmerge: customizedDeepmerge,\n    };\n}\n/**\n * Merge unknown things.\n *\n * @param values - The values.\n */\nfunction mergeUnknowns(values, utils) {\n    const type = getObjectType(values[0]);\n    // eslint-disable-next-line functional/no-conditional-statement -- add an early escape for better performance.\n    if (type !== 0 /* NOT */ && type !== 5 /* OTHER */) {\n        // eslint-disable-next-line functional/no-loop-statement -- using a loop here is more performant than mapping every value and then testing every value.\n        for (let mutableIndex = 1; mutableIndex < values.length; mutableIndex++) {\n            if (getObjectType(values[mutableIndex]) === type) {\n                continue;\n            }\n            return utils.mergeFunctions.mergeOthers(values, utils);\n        }\n    }\n    switch (type) {\n        case 1 /* RECORD */:\n            return utils.mergeFunctions.mergeRecords(values, utils);\n        case 2 /* ARRAY */:\n            return utils.mergeFunctions.mergeArrays(values, utils);\n        case 3 /* SET */:\n            return utils.mergeFunctions.mergeSets(values, utils);\n        case 4 /* MAP */:\n            return utils.mergeFunctions.mergeMaps(values, utils);\n        default:\n            return utils.mergeFunctions.mergeOthers(values, utils);\n    }\n}\n/**\n * Merge records.\n *\n * @param values - The records.\n */\nfunction mergeRecords(values, utils) {\n    const result = {};\n    /* eslint-disable functional/no-loop-statement, functional/no-conditional-statement -- using a loop here is more performant. */\n    for (const key of getKeys(values)) {\n        const propValues = [];\n        for (const value of values) {\n            if (objectHasProperty(value, key)) {\n                propValues.push(value[key]);\n            }\n        }\n        // assert(propValues.length > 0);\n        result[key] =\n            propValues.length === 1\n                ? propValues[0]\n                : mergeUnknowns(propValues, utils);\n    }\n    /* eslint-enable functional/no-loop-statement, functional/no-conditional-statement */\n    return result;\n}\n/**\n * Merge arrays.\n *\n * @param values - The arrays.\n */\nfunction mergeArrays(values, utils) {\n    return values.flat();\n}\n/**\n * Merge sets.\n *\n * @param values - The sets.\n */\nfunction mergeSets(values, utils) {\n    return new Set(getIterableOfIterables(values));\n}\n/**\n * Merge maps.\n *\n * @param values - The maps.\n */\nfunction mergeMaps(values, utils) {\n    return new Map(getIterableOfIterables(values));\n}\n/**\n * Merge \"other\" things.\n *\n * @param values - The values.\n */\nfunction leaf(values, utils) {\n    return values[values.length - 1];\n}\n\n\n\n\n//# sourceURL=webpack://pixiv-filter-v2/./node_modules/deepmerge-ts/dist/node/index.mjs?");

/***/ }),

/***/ "./node_modules/is-plain-object/dist/is-plain-object.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/is-plain-object/dist/is-plain-object.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isPlainObject\": () => (/* binding */ isPlainObject)\n/* harmony export */ });\n/*!\n * is-plain-object <https://github.com/jonschlinkert/is-plain-object>\n *\n * Copyright (c) 2014-2017, Jon Schlinkert.\n * Released under the MIT License.\n */\n\nfunction isObject(o) {\n  return Object.prototype.toString.call(o) === '[object Object]';\n}\n\nfunction isPlainObject(o) {\n  var ctor,prot;\n\n  if (isObject(o) === false) return false;\n\n  // If has modified constructor\n  ctor = o.constructor;\n  if (ctor === undefined) return true;\n\n  // If has modified prototype\n  prot = ctor.prototype;\n  if (isObject(prot) === false) return false;\n\n  // If constructor does not have an Object-specific method\n  if (prot.hasOwnProperty('isPrototypeOf') === false) {\n    return false;\n  }\n\n  // Most likely a plain Object\n  return true;\n}\n\n\n\n\n//# sourceURL=webpack://pixiv-filter-v2/./node_modules/is-plain-object/dist/is-plain-object.mjs?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/background.ts");
/******/ 	
/******/ })()
;