import { ChromeStorage } from './database/chrome_storage';

const fetchWork = async (url: string) => {
  const isRequest = await ChromeStorage.getRequestFlag();
  if (isRequest) return console.log('短期間のリクエストはできません');

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

const callback = async (res: chrome.webRequest.WebResponseCacheDetails) => {
  if (res.initiator !== 'https://www.pixiv.net')
    return console.log('ピクシブからのアクセスではない');

  const keyword = res.url.split('/')[5].split('?')[0];
  console.log(keyword);

  console.log(res.url);

  const getWorks: { [key: string]: () => Promise<object[]> } = {
    top: async () => {
      const json: SearchTop = await fetchWork(res.url);

      return [
        json.body.illustManga?.data ?? {},
        json.body.novel?.data ?? {},
        json.body.popular?.recent ?? {},
        json.body.popular?.permanent ?? {},
      ].flat();
    },
    artworks: async () => {
      const json: Artworks = await fetchWork(res.url);

      return [
        json.body.illustManga?.data ?? {},
        json.body.popular?.recent ?? {},
        json.body.popular?.permanent ?? {},
      ].flat();
    },
    illust: async () => {
      const json: Illustrations = await fetchWork(res.url);

      return [
        json.body.thumbnails?.illust ?? {},
        json.body.thumbnails?.novel ?? {},
      ].flat();
    },
    illustrations: async () => {
      const json: Illustrations = await fetchWork(res.url);

      return [
        json.body.illust?.data ?? {},
        json.body.popular?.recent ?? {},
        json.body.popular?.permanent ?? {},
      ].flat();
    },
    manga: async () => {
      const json: Manga = await fetchWork(res.url);

      return [
        json.body.thumbnails?.illust ?? {},
        json.body.thumbnails?.novel ?? {},
        json.body.manga?.data ?? {},
        json.body.popular?.recent ?? {},
        json.body.popular?.permanent ?? {},
      ].flat();
    },
    novels: async () => {
      const json: Novels = await fetchWork(res.url);
      return [json.body.novel?.data ?? {}].flat();
    },
    novel: async () => {
      const json: Novels = await fetchWork(res.url);
      return [
        json.body.novel?.data ?? {},
        json.body.thumbnails?.illust ?? {},
        json.body.thumbnails?.novel ?? {},
        json.body.thumbnails?.novelSeries ?? {},
      ].flat();
    },
  };

  const keywords = Object.keys(getWorks);
  if (!keywords.includes(keyword)) return;

  const worksData = (await getWorks[keyword]()) as WorksData;

  await ChromeStorage.setWorksData(worksData);

  console.log(worksData);
  console.log(res.initiator);
};

chrome.webRequest.onCompleted.addListener(callback, {
  urls: ['https://www.pixiv.net/ajax/search/*'],
});
