const works: WorkData[] = [];

function filterData(data: any): object {
  // sessionStorage のパースと Set 生成は再帰呼び出しをまたがず 1 回だけ行う
  const blockUsers: BlockUser[] = JSON.parse(
    sessionStorage.getItem('pf-blockUsers') || '[]'
  );
  const blockTags: string[] = JSON.parse(
    sessionStorage.getItem('pf-blockTags') || '[]'
  );
  const blockUserIds = new Set(blockUsers.map((u) => u.userId));
  const blockTagSet = new Set(blockTags);

  function _filter(data: any): object {
    if (Array.isArray(data)) {
      const filteredData: WorkData[] = data.filter((item: WorkData) => {
        return (
          item.isAdContainer ||
          !(
            item.tags?.some((tag) => blockTagSet.has(tag)) ||
            blockUserIds.has(item.userId ?? '')
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
        data[key] = _filter(data[key]);
      }
    }

    return data;
  }

  return _filter(data);
}

export default filterData;
