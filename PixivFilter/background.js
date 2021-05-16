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
        if (url.includes('https://www.pixiv.net/ajax/top/')) {
            console.log(url);
            chrome.tabs.sendMessage(await getTabId(), "");
        }

        if (url.includes('https://www.pixiv.net/ajax/search/artworks/') && count === 0) {
            count += 1;
            console.log(count)

            const json = fetch(url).then((res) => { return (res.json()); });
            console.log(await json);
            chrome.tabs.sendMessage(await getTabId(), "");
        } else { count = 0; };
    },
    { urls: ['*://www.pixiv.net/*'] },
    ['requestBody', 'blocking']
);