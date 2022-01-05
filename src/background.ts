import { deepmerge } from 'deepmerge-ts';

const getTabId = () =>
  new Promise<number>((resolve, reject) => {
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

chrome.webRequest.onBeforeRequest.addListener(
  (e) => {
    (async () => {
      const url = e.url;
      const searchTargets = [
        'https://www.pixiv.net/ajax/search/illustrations/',
        'https://www.pixiv.net/ajax/search/artworks/',
        'https://www.pixiv.net/ajax/search/manga/',
        'https://www.pixiv.net/ajax/search/top/',
      ];
      await Promise.all(
        searchTargets.map(async (searchTarget) => {
          if (url.includes(searchTarget) && count === 0) {
            count += 1;
            console.log(count);

            const json = await fetch(url).then((res) => {
              return res.json();
            });
            console.log(json);

            let illustDatas = [];
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
            illustDatas = illustDatas.filter((n) => {
              return n != undefined;
            });
            console.log(illustDatas);

            chrome.tabs.sendMessage(await getTabId(), illustDatas);
          }
        })
      );
      count = 0;
    })();
  },
  { urls: ['*://www.pixiv.net/*'] },
  ['requestBody', 'blocking']
);

(async () => {
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

  const setSyncStorage = () => {
    chrome.storage.sync.set({
      tagName: ['tag'],
      userKey: [{ userId: '1111', userName: 'aaa' }],
    });
  };
  // setSyncStorage();

  const getLocalStorage = () => {
    return new Promise<NGData>((resolve, reject) => {
      chrome.storage.local.get(null, (result: { [key: string]: NGData }) => {
        resolve(result);
      });
    });
  };

  const merged = deepmerge(await getSyncStorage(), await getLocalStorage());
  console.log(merged);

  const setLocalStorage = (NGObject: NGData) => {
    chrome.storage.local.set(NGObject);
  };
  const SyncObject = await getSyncStorage();

  if (Object.keys(SyncObject).length) {
    // setLocalStorage(merged);
  } else {
    return;
  }
})();
