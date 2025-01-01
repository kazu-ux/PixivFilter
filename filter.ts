/* eslint-disable @typescript-eslint/no-explicit-any */
interface WorkData {
  id?: string;
  title?: string;
  userId?: string;
  userName?: string;
  tags?: string[];
  isAdContainer?: boolean;
}

interface PixivJson {
  error: boolean;
  body: {
    illusts:
      | {
          [key: string]: WorkData;
        }
      | WorkData[];
    manga: {
      [key: string]: WorkData | WorkData[];
      data: WorkData[];
    };
    novel: { data: WorkData[] };
    novels:
      | {
          [key: string]: WorkData;
        }
      | WorkData[];
    illust: { data: WorkData[] };
    popular: {
      permanent: WorkData[];
      recent: WorkData[];
    };
    illustManga: { data: WorkData[] };
    thumbnails: { illust: WorkData[]; novel: WorkData[] };
    works: {
      [key: string]: WorkData;
    };
  };
}

const blockUsers: string[] = JSON.parse(
  localStorage.getItem('blockUsers') || '[]'
);

const blockTags: string[] = JSON.parse(
  localStorage.getItem('blockTags') || '[]'
);
console.log(blockTags);

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

type AnyObject = { [key: string]: any };

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
  '/ajax/search/tags/',
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
];

const _fetch = fetch.bind(null);
window.fetch = async function (
  input: string | URL | globalThis.Request,
  init?: RequestInit
) {
  const response: Response = await _fetch(input, init);
  console.log(input);

  if (!targetUrls.some((url) => input.toString().includes(url)))
    return response;

  if (response.ok) {
    const works: WorkData[] = [];

    const data: PixivJson = await response.clone().json();

    function filterData(data: any) {
      if (Array.isArray(data)) {
        // blockUserやblockTagが指定されたものと一致しないオブジェクトのみを抽出
        const filteredData: WorkData[] = data.filter((item: WorkData) => {
          return (
            item.isAdContainer ||
            !(
              item.tags?.some((tag) => blockTags.includes(tag)) ||
              blockUsers.includes(item.userId ?? '')
            )
          );
        });

        const isWork = filteredData.some(
          (item: WorkData) => item.id && item.userId
        );
        if (isWork) {
          works.push(...filteredData);
        }
        console.log('フィルタリング...');

        return filteredData;
      }

      for (const key in data) {
        if (data[key] === null) return data;
        if (typeof data[key] === 'object') {
          data[key] = filterData(data[key]);
        }
      }

      return data;
    }

    function getNestedValue<T extends Record<string, any>, R = any>(
      obj: T,
      path: string
    ): R | undefined {
      // 入力値のバリデーション
      if (!obj || typeof obj !== 'object') {
        return undefined;
      }
      if (!path) {
        return undefined;
      }

      // パスを配列に分割
      const keys = path.split('.');

      // 再帰的に値を取得
      return keys.reduce<any>((value, key) => {
        return value && typeof value === 'object' ? value[key] : undefined;
      }, obj);
    }

    try {
      if (!data) return data;

      const paths = findPaths(data, 'R-18');
      const isArray = Array.isArray(
        getNestedValue(data, paths[0].split('.tags')[0])
      );

      paths.forEach((value) => {
        if (isArray) {
          return;
        }
        excludeByPath(data, value.split('.tags')[0]);
      });
    } catch (error) {
      console.log(error);
    }

    const blob = new Blob([JSON.stringify(filterData(data), null, 2)], {
      type: 'application/json',
    });

    return new Response(blob, { status: 200, statusText: 'OK' });
  } else {
    console.log(response.statusText);
    return response;
  }
};
