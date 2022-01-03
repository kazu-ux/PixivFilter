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
        const url = e.url;
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

                chrome.tabs.sendMessage(await getTabId(), illustDatas);
            };

        }));
        count = 0;
    },
    { urls: ['*://www.pixiv.net/*'] },
    ['requestBody', 'blocking']
);