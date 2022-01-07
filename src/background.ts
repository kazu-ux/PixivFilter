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

            let illustDatas;
            if (
              searchTarget === 'https://www.pixiv.net/ajax/search/artworks/' ||
              searchTarget === 'https://www.pixiv.net/ajax/search/top/'
            ) {
              illustDatas = json.body.illustManga.data;
            } else if (
              searchTarget ===
              'https://www.pixiv.net/ajax/search/illustrations/'
            ) {
              illustDatas = json.body.illust.data;
            } else if (
              searchTarget === 'https://www.pixiv.net/ajax/search/manga/'
            ) {
              illustDatas = json.body.manga.data;
            }

            illustDatas = await Promise.all(
              illustDatas.map((illustData: { id: any; tags: any[] }) => {
                const illustId = illustData.id;
                const tags = illustData.tags;
                if (illustId) {
                  return { illustId: illustId, tags: tags };
                }
              })
            );
            illustDatas = illustDatas.filter(Boolean);
            console.log(illustDatas);

            chrome.tabs.sendMessage(tabId, illustDatas);
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
  type NGData =
    | {}
    | {
        tagName: string[];
        userKey: { userId: string; uerName: string }[];
      };

  const getSyncStorage = () => {
    return new Promise<NGData>((resolve, reject) => {
      chrome.storage.sync.get(null, (result: { [key: string]: NGData }) => {
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
    return new Promise<NGData>((resolve, reject) => {
      chrome.storage.local.get(null, (result: { [key: string]: NGData }) => {
        resolve(result);
      });
    });
  };

  const setLocalStorage = (NGObject: NGData) => {
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
