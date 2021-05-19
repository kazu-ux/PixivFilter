const getTabId = () => new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        const tabId = tab[0].id
        console.log(tabId);
        resolve(tabId);
    });
});

let count = 0;

chrome.webRequest.onBeforeRequest.addListener(
    async (e) => {
        //console.log(e);
        const url = e.url;
        console.log(url)
        /*
        if (url.includes('https://www.pixiv.net/ajax/top/')) {
            console.log(url);
            chrome.tabs.sendMessage(await getTabId(), "");
        }
        */

        const searchTargets = [
            "https://www.pixiv.net/ajax/search/illustrations/",
            "https://www.pixiv.net/ajax/search/artworks/",
            "https://www.pixiv.net/ajax/search/manga/",
            "https://www.pixiv.net/ajax/search/top/"
        ];
        await Promise.all(searchTargets.map(async (searchTarget) => {
            if (url.includes(searchTarget) && count === 0) {
                count += 1;
                console.log(count);

                const json = await fetch(url).then((res) => { return (res.json()); });
                console.log(json);

                let illustDatas = [];
                if (searchTarget === 'https://www.pixiv.net/ajax/search/artworks/' || searchTarget === 'https://www.pixiv.net/ajax/search/top/') {
                    illustDatas = json.body.illustManga.data;
                } else if (searchTarget === 'https://www.pixiv.net/ajax/search/illustrations/') {
                    illustDatas = json.body.illust.data;
                } else if (searchTarget === 'https://www.pixiv.net/ajax/search/manga/') {
                    illustDatas = json.body.manga.data;
                };

                illustDatas = await Promise.all(illustDatas.map((illustData) => {
                    const illustId = illustData.id;
                    const tags = illustData.tags;
                    if (illustId) {
                        return { illustId: illustId, tags: tags };
                    };
                }));
                illustDatas = illustDatas.filter((n) => { return n != undefined });
                console.log(illustDatas);

                //chrome.storage.local.set({ illustDatas: illustDatas });

                //chrome.storage.local.get(null, (result) => { console.log(result); });
                //{illustId:"",tags:[]}
                //chrome.tabs.executeScript({ file: 'content_script.js' });
                chrome.tabs.sendMessage(await getTabId(), illustDatas);
            } /*else { count = 0; }*/;

        }));
        count = 0;
    },
    { urls: ['*://www.pixiv.net/*'] },
    ['requestBody', 'blocking']
);

/*
let count = 0;
const tabStatus = async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("https://www.pixiv.net/tags/") && count === 0) {
        count += 1;
        console.log(tabId, changeInfo, tab);
        console.log(tab.url);

        const json = await fetch(url).then((res) => { return (res.json()); });
        console.log(json);

        let illustDatas = json.body.illustManga.data;

        illustDatas = await Promise.all(illustDatas.map((illustData) => {
            const illustId = illustData.id;
            const tags = illustData.tags;
            if (illustId) {
                return { illustId: illustId, tags: tags };
            };
        }));
        illustDatas = illustDatas.filter((n) => { return n != undefined });
        console.log(illustDatas);
        chrome.tabs.sendMessage(await getTabId(), illustDatas);
    };
};

chrome.tabs.onUpdated.addListener(tabStatus);
*/