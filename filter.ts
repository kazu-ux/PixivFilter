import collectArrays from './entrypoints/content/utils/collect_arrays';
import filterData from './entrypoints/content/utils/filter_json';

const targetUrls = [
  '/ajax/search/top/',
  '/ajax/search/artworks/',
  '/ajax/search/illustrations/',
  '/ajax/search/manga/',
  '/ajax/search/novels/',
  // '/ajax/follow_latest/illust',
  // '/ajax/follow_latest/novel',
  // '/ajax/discovery/novels',
  // '/ajax/discovery/artworks',
  // '/ajax/discovery/users',
  // '/ajax/user/',
  // '/ajax/top/illust',
  // '/ajax/top/manga',
  '/ajax/illust/',
];

// 元の fetch を保存
const originalFetch = window.fetch;

// fetch を上書き
window.fetch = async function (...args) {
  // リクエストの詳細を表示
  const requestUrl = args[0];
  const requestOptions = args[1] || {};

  // 元の fetch を呼び出し
  const response = await originalFetch.apply(this, args);

  // 開いているページが検索結果ページかどうかを判定する
  // if (!location.href.includes('/tags/')) return response;

  // 対象の URL をチェック
  if (!targetUrls.some((url) => requestUrl.toString().includes(url)))
    return response;

  // レスポンスをクローンして内容を取得
  const clonedResponse = response.clone();

  try {
    const data = await clonedResponse.json();

    // jsonの値が配列のものを全て抽出し、一元化
    const arrays = collectArrays(data);
    // 配列の中からtagsキーを含むものを抽出
    const filteredArrays: WorkData[] = arrays.filter((item) =>
      Object.keys(item).includes('tags')
    );
    const currentUrl = document.location.href;

    // 表示中のページのコンテンツスクリプトに作品データを送る
    window.postMessage(filteredArrays, currentUrl);

    // ブロックする作品を除外
    const filteredData = filterData(data);

    return new Response(JSON.stringify(filteredData), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return response;
  }
};
