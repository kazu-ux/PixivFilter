type UserData = { userId: string; userName: string };
type RequestFlag = { requestFlag: boolean };

type WorkData = {
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
  seriesId?: string;
  seriesTitle?: string;
  isRead?: boolean;
};

type SearchTop = {
  body: {
    illustManga?: { data: WorksData };
    novel?: { data: WorksData };
    popular?: { recent: WorksData; permanent: WorksData };
  };
};

type Illustrations = {
  body: {
    illust?: { data: WorksData };
    popular?: { recent: WorksData; permanent: WorksData };
    thumbnails?: { illust: WorksData; novel: WorksData };
  };
};

type Manga = {
  body: {
    manga?: { data: WorksData };
    popular?: { recent: WorksData; permanent: WorksData };
    thumbnails?: { illust: WorksData; novel: WorksData };
  };
};

type Novels = {
  body: {
    novel?: { data: WorksData };
    thumbnails?: {
      illust: WorksData;
      novel: WorksData;
      novelSeries: WorksData;
    };
  };
};

type Artworks = SearchTop;

type WatchWork = {
  displayName: string;
  worksData: WorkData[];
  url: string;
  readWorks?: string[];
};

type SearchTargetPath = 'artworks' | 'illustrations' | 'manga' | 'novel';
type SearchTargetParameter =
  | 'all'
  | 'illust_and_ugoira'
  | 'illust'
  | 'manga'
  | 'ugoira';
type SearchMethodParameter = 's_tag' | 's_tag_full' | 's_tc';
type TargetAgeParameter = 'all' | 'safe' | 'r18';
type parameterKey = 'type' | 's_mode' | 'mode';

interface SearchQuery {
  searchWord: string;
  searchTarget: [SearchTargetPath, SearchTargetParameter];
  searchMethod: SearchMethodParameter;
  targetAge: TargetAgeParameter;
}
