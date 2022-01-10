import { getRequest } from './fetch_api';

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
      // 状態管理にlocalstorageを使う
      searchTargets.forEach(async (searchTarget) => {
        const isEnabled = () => {
          return new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.get(['state'], (result) => {
              resolve(result.state);
            });
          });
        };
        if (
          url.includes(searchTarget) &&
          initiator === 'https://www.pixiv.net' &&
          (await isEnabled())
        ) {
          const worksData = await getRequest(url);
          await chrome.storage.local.set({ state: false });
          console.log(worksData);
          chrome.tabs.sendMessage(tabId, { url, worksData });
        }
      });
    })();
  },
  { urls: ['*://www.pixiv.net/*'] },
  ['requestBody', 'blocking']
);

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.set({ state: true });
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
