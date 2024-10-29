/* eslint-disable @typescript-eslint/no-explicit-any */
interface WorkData {
  id?: string;
  title?: string;
  userId?: string;
  userName?: string;
  tags?: string[];
  isAdContainer?: boolean;
}

const blockUsers = ['とりっきぃ'];
const blockTags = ['R-18', 'ゆるゆり', 'とある科学の超電磁砲'];

const _fetch = fetch.bind(null);
window.fetch = async function (
  input: string | URL | globalThis.Request,
  init?: RequestInit
) {
  const response: Response = await _fetch(input, init);
  if (response.ok) {
    console.log('フィルタリング....');

    const works: WorkData[] = [];

    const data = await response.clone().json();
    // console.log(data);

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

        console.log(filteredData);

        const isWork = filteredData.some(
          (item: WorkData) => item.id && item.userId
        );
        if (isWork) {
          works.push(...filteredData);
        }

        return filteredData;
      }
      for (const key in data) {
        if (typeof data[key] === 'object') {
          data[key] = filterData(data[key]);
        }
      }

      return data;
    }

    const blob = new Blob([JSON.stringify(filterData(data), null, 2)], {
      type: 'application/json',
    });
    const init = {
      status: data.status,
      statusText: data.statusText,
    };
    return new Response(blob, init);
  } else {
    console.log(response.statusText);
    return response;
  }
};
