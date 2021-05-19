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
        if (url.includes('https://www.pixiv.net/ajax/top/')) {
            console.log(url);
            chrome.tabs.sendMessage(await getTabId(), "");
        }

        if (url.includes('https://www.pixiv.net/ajax/search/artworks/') && count === 0) {
            count += 1;
            console.log(count);

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
            //{illustId:"",tags:[]}
            chrome.tabs.sendMessage(await getTabId(), illustDatas);
        } else { count = 0; };
    },
    { urls: ['*://www.pixiv.net/*'] },
    ['requestBody', 'blocking']
);