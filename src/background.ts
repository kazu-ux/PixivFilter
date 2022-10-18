import { ChromeStorage } from './database/chrome_storage';
import MigrateStorage from './migrate_storage';

const fetchWork = async (url: string) => {
  const isRequest = await ChromeStorage.getRequestFlag();
  //ディスカバリーは同時に複数のリクエストが発生することがある
  if (isRequest && !url.startsWith('https://www.pixiv.net/ajax/discovery/artworks')) {
    console.log('短期間のリクエストはできません');
    return;
  }

  await ChromeStorage.setRequestFlag(true);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(url);
  if (response.ok) {
    try {
      console.log(await ChromeStorage.getRequestFlag());

      const json = await response.json();
      console.log(json);
      await ChromeStorage.setRequestFlag(false);
      return json;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log(response.status);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await ChromeStorage.setRequestFlag(false);

    return;
  }
};

(async () => {
  MigrateStorage();
  await ChromeStorage.setRequestFlag(false);

  const savedUsers = ChromeStorage.getBlockUsers();
  if (savedUsers) {
    savedUsers.then((res) => {
      console.log(res);
    });
  }
})();

chrome.runtime.onMessage.addListener((res) => {
  console.log(res);
});

chrome.webRequest.onCompleted.addListener(
  async (res) => {
    if ( res.url.startsWith('https://www.pixiv.net/ajax/discovery/artworks/meta')){
      return;
    }
    if (res.initiator === 'https://www.pixiv.net') {
      //リクエストパラメータを除外
      const paths = res.url.split('?')[0].split('/');
      const keyword = paths[4]+'_'+paths[5];
      console.log(keyword);

      const getWorks: { [key: string]: () => Promise<object[]> } = {
        search_top: async () => {
          const json: SearchTop = await fetchWork(res.url);

          return [
            json.body.illustManga.data,
            json.body.novel.data,
            json.body.popular.recent,
            json.body.popular.permanent,
          ].flat();
        },
        search_artworks: async () => {
          const json: Artworks = await fetchWork(res.url);

          return [
            json.body.illustManga.data,
            json.body.popular.recent,
            json.body.popular.permanent,
          ].flat();
        },
        search_illustrations: async () => {
          const json: Illustrations = await fetchWork(res.url);

          return [
            json.body.illust.data,
            json.body.popular.recent,
            json.body.popular.permanent,
          ].flat();
        },
        search_manga: async () => {
          const json: Manga = await fetchWork(res.url);

          return [
            json.body.manga.data,
            json.body.popular.recent,
            json.body.popular.permanent,
          ].flat();
        },
        search_novels: async () => {
          const json: Novels = await fetchWork(res.url);
          return json.body.novel.data;
        },
        discovery_artworks: async () => {
          const json: DiscoveryArtworks = await fetchWork(res.url);

          return [
              json.body.thumbnails.illust,
          ].flat();
        }
      };

      const worksData = (await getWorks[keyword]()) as WorksData;
      await ChromeStorage.setWorksData(worksData);
      let count = 0;
      const sendMessageFunc = async (error: Error) => {
        count++;
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(count);
        console.log(error);
        return chrome.tabs.sendMessage(res.tabId, '');
      };

      Promise.reject()
        .catch(sendMessageFunc)
        .catch(sendMessageFunc)
        .catch(sendMessageFunc)
        .catch(sendMessageFunc)

        .then(() => {
          count = 0;
          console.log(count);
          console.log('成功');
        });
      console.log(worksData);

      console.log(res);
      console.log(res.initiator);
      return;
    }

    console.log('ピクシブからのアクセスではない');
  },
  {
    urls: [
      'https://www.pixiv.net/ajax/search/top/*',
      'https://www.pixiv.net/ajax/search/artworks/*',
      'https://www.pixiv.net/ajax/search/illustrations/*',
      'https://www.pixiv.net/ajax/search/manga/*',
      'https://www.pixiv.net/ajax/search/novels/*',
      'https://www.pixiv.net/ajax/discovery/*',
    ],
  }
);

export {};
