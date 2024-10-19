import { ChromeStorage } from './utils/chrome_storage';
import { WorksStyle } from './works_style';

export default defineBackground(() => {
  console.log('background.ts');

  chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
  });

  chrome.runtime.onMessage.addListener((css: string, sender) => {
    const tabId = sender.tab?.id;
    if (!tabId) return;
    if (!css) return;

    chrome.scripting.insertCSS({
      target: { tabId },
      css,
    });
    return;
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = tab.url;
    const isLoading = changeInfo.status === 'loading';
    if (!url?.startsWith('https://www.pixiv.net/tags/')) return;
    if (!isLoading) return;

    chrome.scripting.insertCSS({
      target: { tabId },
      css: WorksStyle.hidden,
    });

    return;
  });

  chrome.webRequest.onCompleted.addListener(
    async (res) => {
      const fetchWork = async (url: string) => {
        const isRequest = await ChromeStorage.getRequestFlag();
        if (isRequest) {
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

      if (res.initiator === 'https://www.pixiv.net') {
        const keyword = res.url.split('/')[5];
        console.log(keyword);

        const getWorks: { [key: string]: () => Promise<object[]> } = {
          top: async () => {
            const json: SearchTop = await fetchWork(res.url);

            return [
              json.body.illustManga.data,
              json.body.novel.data,
              json.body.popular.recent,
              json.body.popular.permanent,
            ].flat();
          },
          artworks: async () => {
            const json: Artworks = await fetchWork(res.url);

            return [
              json.body.illustManga.data,
              json.body.popular.recent,
              json.body.popular.permanent,
            ].flat();
          },
          illustrations: async () => {
            const json: Illustrations = await fetchWork(res.url);

            return [
              json.body.illust.data,
              json.body.popular.recent,
              json.body.popular.permanent,
            ].flat();
          },
          manga: async () => {
            const json: Manga = await fetchWork(res.url);

            return [
              json.body.manga.data,
              json.body.popular.recent,
              json.body.popular.permanent,
            ].flat();
          },
          novels: async () => {
            const json: Novels = await fetchWork(res.url);
            return json.body.novel.data;
          },
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

      console.log('サービスワーカーからのアクセス');
    },
    {
      urls: [
        'https://www.pixiv.net/ajax/search/top/*',
        'https://www.pixiv.net/ajax/search/artworks/*',
        'https://www.pixiv.net/ajax/search/illustrations/*',
        'https://www.pixiv.net/ajax/search/manga/*',
        'https://www.pixiv.net/ajax/search/novels/*',
      ],
    }
  );
});
