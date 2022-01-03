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
const getTabId = () => new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        const tabId = tab[0].id;
        if (!tabId) {
            return;
        }
        console.log(tabId);
        resolve(tabId);
    });
});
let count = 0;
chrome.webRequest.onBeforeRequest.addListener((e) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const url = e.url;
        const searchTargets = [
            'https://www.pixiv.net/ajax/search/illustrations/',
            'https://www.pixiv.net/ajax/search/artworks/',
            'https://www.pixiv.net/ajax/search/manga/',
            'https://www.pixiv.net/ajax/search/top/',
        ];
        yield Promise.all(searchTargets.map((searchTarget) => __awaiter(void 0, void 0, void 0, function* () {
            if (url.includes(searchTarget) && count === 0) {
                count += 1;
                console.log(count);
                const json = yield fetch(url).then((res) => {
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
                illustDatas = yield Promise.all(illustDatas.map((illustData) => {
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
                chrome.tabs.sendMessage(yield getTabId(), illustDatas);
            }
        })));
        count = 0;
    }))();
}, { urls: ['*://www.pixiv.net/*'] }, ['requestBody', 'blocking']);
