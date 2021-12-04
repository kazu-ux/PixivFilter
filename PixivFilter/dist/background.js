"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let count = 0;
function getIllusts(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (yield fetch(url)).json();
        console.log(response.body);
    });
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var _a;
    if (changeInfo.status === 'complete' &&
        ((_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('https://www.pixiv.net/tags/'))) {
        //  console.log({ tabId, changeInfo, tab });
    }
});
chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.url.includes('https://www.pixiv.net/ajax/search/') &&
        details.initiator === 'https://www.pixiv.net') {
        count += 1;
        getIllusts(details.url);
        console.log(details);
    }
}, { urls: ['https://www.pixiv.net/*'] });
