const works: WorkData[] = [];

const blockUsers: UserData[] = JSON.parse(
  sessionStorage.getItem('pf-blockUsers') || '[]'
);

const blockTags: string[] = JSON.parse(
  sessionStorage.getItem('pf-blockTags') || '[]'
);

function filterData(data: any): object {
  if (Array.isArray(data)) {
    // blockUserやblockTagが指定されたものと一致しないオブジェクトのみを抽出
    const filteredData: WorkData[] = data.filter((item: WorkData) => {
      return (
        item.isAdContainer ||
        !(
          item.tags?.some((tag) => blockTags.includes(tag)) ||
          blockUsers.map((user) => user.userId).includes(item.userId ?? '')
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

export default filterData;
