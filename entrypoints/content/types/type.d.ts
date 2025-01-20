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
