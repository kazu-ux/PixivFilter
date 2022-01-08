chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
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
      await Promise.all(
        searchTargets.map(async (searchTarget) => {
          if (
            url.includes(searchTarget) &&
            initiator === 'https://www.pixiv.net'
          ) {
            const json = await fetch(url).then((res) => {
              return res.json();
            });
            console.log(json);

            let worksData: WorksData = [];
            if (
              searchTarget === 'https://www.pixiv.net/ajax/search/artworks/' ||
              searchTarget === 'https://www.pixiv.net/ajax/search/top/'
            ) {
              worksData = worksData.concat(
                json.body.illustManga.data,
                json.body.popular.permanent,
                json.body.popular.recent
              );
            } else if (
              searchTarget ===
              'https://www.pixiv.net/ajax/search/illustrations/'
            ) {
              worksData = json.body.illust.data;
            } else if (
              searchTarget === 'https://www.pixiv.net/ajax/search/manga/'
            ) {
              worksData = json.body.manga.data;
            }

            worksData = worksData.filter(Boolean);
            console.log(worksData);

            chrome.tabs.sendMessage(tabId, worksData);
          }
        })
      );
    })();
  },
  { urls: ['*://www.pixiv.net/*'] },
  ['requestBody', 'blocking']
);

chrome.runtime.onInstalled.addListener(async () => {
  console.log('test');

  const getSyncStorage = () => {
    return new Promise<NGObject>((resolve, reject) => {
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
    return new Promise<NGObject>((resolve, reject) => {
      chrome.storage.local.get(null, (result) => {
        resolve(result);
      });
    });
  };

  const setLocalStorage = (NGObject: NGObject) => {
    chrome.storage.local.set(NGObject);
  };
  const syncObject = await getSyncStorage();
  const localObject = await getLocalStorage();

  if (Object.keys(syncObject).length && !Object.keys(localObject).length) {
    setLocalStorage(syncObject);
  } else {
    return;
  }
});
