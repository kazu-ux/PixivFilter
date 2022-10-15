type UserData = { userId: string; userName: string };
type RequestFlag = { requestFlag: boolean };

type WorksData = Array<{
  id: string;
  title: string;
  illustType?: number;
  xRestrict: number;
  restrict: number;
  sl?: number;
  url: string;
  description: string;
  tags: Array<string>;
  userId: string;
  userName: string;
  width?: number;
  height?: number;
  pageCount?: number;
  isBookmarkable: boolean;
  bookmarkData: unknown;
  alt?: string;
  titleCaptionTranslation: {
    workTitle: unknown;
    workCaption: unknown;
  };
  createDate: string;
  updateDate: string;
  isUnlisted: boolean;
  isMasked: boolean;
  profileImageUrl: string;
  textCount?: number;
  wordCount?: number;
  readingTime?: number;
  useWordCount?: boolean;
  bookmarkCount?: number;
  isOriginal?: boolean;
  marker: unknown;
  seriesId?: string;
  seriesTitle?: string;
}>;

type SearchTop = {
  error: boolean;
  body: {
    novel: { data: WorksData };
    popular: {
      recent: WorksData;
      permanent: WorksData;
    };
    illustManga: {
      data: WorksData;
    };
  };
};

type Illustrations = {
  error: boolean;
  body: {
    illust: {
      data: WorksData;
    };
    popular: {
      recent: WorksData;
      permanent: WorksData;
    };
  };
};

type Manga = {
  error: boolean;
  body: {
    manga: {
      data: WorksData;
    };
    popular: {
      recent: WorksData;
      permanent: WorksData;
    };
  };
};

type Novels = {
  error: boolean;
  body: {
    novel: {
      data: WorksData;
    };
  };
};

type Artworks = {
  error: boolean;
  body: {
    illustManga: {
      data: WorksData;
    };
    popular: {
      recent: WorksData;
      permanent: WorksData;
    };
  };
};
