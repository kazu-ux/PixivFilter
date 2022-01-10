export const getRequest = async (url: string, pages?: string) => {
  const getWorksData = (json: any) => {
    let worksData: WorksData = [];
    try {
      worksData = worksData.concat(
        json.body.illustManga.data,
        json.body.popular.permanent,
        json.body.popular.recent
      );
    } catch (error) {}
    try {
      worksData = json.body.illust.data;
    } catch (error) {}
    try {
      worksData = json.body.manga.data;
    } catch (error) {}
    return worksData;
  };
  if (!pages) {
    const json = await (await fetch(url)).json();
    const worksData = getWorksData(json)!
      .filter(Boolean)
      .flatMap((data) => {
        if (Object.keys(data).includes('isAdContainer')) {
          return [];
        }
        return [data];
      });

    return worksData;
  }

  const newURL = new URL(url);
  newURL.searchParams.set('p', pages);
  const href = newURL.href;
  console.log(href);
  const json = await (await fetch(href)).json();
  const worksData = getWorksData(json)!
    .filter(Boolean)
    .flatMap((data) => {
      if (Object.keys(data).includes('isAdContainer')) {
        return [];
      }
      return [data];
    });

  return worksData;
};
