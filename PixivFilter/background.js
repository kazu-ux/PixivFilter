let count = 0;
chrome.webRequest.onBeforeRequest.addListener(
    async (e) => {
        const url = e.url;

        if (url.includes('https://www.pixiv.net/ajax/search/artworks/') && count === 0) {
            count += 1;
            console.log(count)

            const json = fetch(url).then((res) => { return (res.json()); });
            console.log(await json);
        }

    },
    { urls: ['*://www.pixiv.net/*'] },
    ['requestBody', 'blocking']
);