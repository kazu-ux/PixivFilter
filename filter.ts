import collectArrays from './entrypoints/content/utils/collect_arrays';
import filterData from './entrypoints/content/utils/filter_json';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ブロック対象の作品のパスを探す
const findPaths = (obj: any, target: any, path: string = ''): string[] => {
  let paths: string[] = [];

  for (const key in obj) {
    const newPath = path ? `${path}.${key}` : key;
    const value = obj[key];

    if (value === target) {
      paths.push(newPath);
    } else if (Array.isArray(value)) {
      // 配列の場合、各要素をインデックスなしで探索
      value.forEach((item) => {
        if (item === target) {
          paths.push(newPath);
        } else if (typeof item === 'object' && item !== null) {
          paths = paths.concat(findPaths(item, target, newPath));
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      // オブジェクトの場合は再帰的に探索
      paths = paths.concat(findPaths(value, target, newPath));
    }
  }

  return paths;
};

function getObjectPaths(
  obj: Record<string, any>,
  prefix: string = ''
): string[] {
  const paths: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (Array.isArray(value)) {
        // 配列の場合は再帰処理をスキップし、キーだけ追加
        paths.push(path);
      } else if (typeof value === 'object' && value !== null) {
        // オブジェクトの場合は再帰処理
        paths.push(...getObjectPaths(value, path));
      } else {
        // それ以外の値の場合はキーを追加
        paths.push(path);
      }
    }
  }
  return paths;
}

function getValueByPath(obj: Record<string, any>, path: string): any {
  const keys = path.split('.');
  let value: any = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // パスが無効な場合は undefined を返す
      return undefined;
    }
  }

  return value;
}

type AnyObject = { [key: string]: any };

// パスを元にPixivのJSONから作品を削除
const excludeByPath = (obj: AnyObject, path: string): AnyObject => {
  const keys = path.split('.');
  const result = { ...obj };

  const recursiveExclude = (current: AnyObject, keys: string[]): void => {
    if (keys.length === 1) {
      delete current[keys[0]];
      return;
    }
    const [first, ...rest] = keys;
    if (current[first] && typeof current[first] === 'object') {
      recursiveExclude(current[first], rest);
    }
  };

  recursiveExclude(result, keys);
  return result;
};

const targetUrls = [
  // '/ajax/search/tags/',
  '/ajax/search/top/',
  '/ajax/search/artworks/',
  '/ajax/search/illustrations/',
  '/ajax/search/manga/',
  '/ajax/search/novels/',
  '/ajax/follow_latest/illust',
  '/ajax/follow_latest/novel',
  '/ajax/discovery/novels',
  '/ajax/discovery/artworks',
  '/ajax/discovery/users',
  '/ajax/user/',
  '/ajax/top/illust',
  '/ajax/top/manga',
  '/ajax/illust/recommend/',
];

// 元の fetch を保存
const originalFetch = window.fetch;

// fetch を上書き
window.fetch = async function (...args) {
  // リクエストの詳細を表示
  const requestUrl = args[0];
  const requestOptions = args[1] || {};
  // console.log('URL:', requestUrl);
  // console.log('Options:', requestOptions);

  // 元の fetch を呼び出し
  const response = await originalFetch.apply(this, args);

  // 開いているページが検索結果ページかどうかを判定する
  if (!document.location.href.startsWith('https://www.pixiv.net/tags/'))
    return response;

  // 対象の URL をチェック
  if (!targetUrls.some((url) => requestUrl.toString().includes(url)))
    return response;

  // レスポンスをクローンして内容を取得
  const clonedResponse = response.clone();

  try {
    const data = await clonedResponse.json();

    const arrays = collectArrays(data);
    const filteredArrays: WorkData[] = arrays.filter(
      (item) =>
        Object.keys(item).includes('tags') &&
        !Object.keys(item).includes('textCount')
    );
    const currentUrl = document.location.href;
    console.log(filteredArrays);

    window.postMessage(filteredArrays, currentUrl);

    // ブロックする作品を除外
    const filteredData = filterData(data);
    // console.log({ url: args[0], data });

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

// const _fetch = fetch.bind(null);
// window.fetch = async function (
//   input: string | URL | globalThis.Request,
//   init?: RequestInit
// ) {
//   const response: Response = await _fetch(input, init);

//   try {
//     console.log(await response.clone().json());
//     return response;
//   } catch (error) {
//     console.log(error);
//     return response;
//   }

//   if (!targetUrls.some((url) => input.toString().includes(url)))
//     return response;

//   if (response.ok) {
//     const works: WorkData[] = [];

//     const data: PixivJson = await response.clone().json();

//     // const allPaths = getObjectPaths(data);
//     // const tagsPaths = allPaths.filter((path) => path.includes('.tags'));

//     // try {
//     //   // const blockTag = 'R-18';
//     //   const filteredPaths = tagsPaths.filter((path) => {
//     //     const value: string[] = getValueByPath(data, path);
//     //     // return value.some((tag: string) => tag === blockTag);
//     //     return value.some((tag: string) => blockTags.includes(tag));
//     //   });
//     //   console.log(filteredPaths);

//     //   filteredPaths.forEach((value) => {
//     //     excludeByPath(data, value.split('.tags')[0]);
//     //   });
//     // } catch (error) {
//     //   console.log(error);
//     // }

//     // console.log({ allPaths, tagsPaths });

//     const blob = new Blob([JSON.stringify(filterData(data), null, 2)], {
//       type: 'application/json',
//     });

//     return new Response(blob, { status: 200, statusText: 'OK' });
//   } else {
//     console.log(response.statusText);
//     return response;
//   }
// };
