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
    novel: {
      data: Array<{
        id: string;
        title: string;
        xRestrict: number;
        restrict: number;
        url: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        profileImageUrl: string;
        textCount: number;
        wordCount: number;
        readingTime: number;
        useWordCount: boolean;
        description: string;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        bookmarkCount: number;
        isOriginal: boolean;
        marker: unknown;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isMasked: boolean;
        isUnlisted: boolean;
        seriesId?: string;
        seriesTitle?: string;
      }>;
      total: number;
    };
    popular: {
      recent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
      permanent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
    };
    relatedTags: Array<string>;
    tagTranslation: Array<unknown>;
    zoneConfig: {
      header: {
        url: string;
      };
      footer: {
        url: string;
      };
      infeed: {
        url: string;
      };
    };
    extraData: {
      meta: {
        title: string;
        description: string;
        canonical: string;
        alternateLanguages: {
          ja: string;
          en: string;
        };
        descriptionHeader: string;
      };
    };
    illustManga: {
      data: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
      total: number;
    };
  };
};

type Illustrations = {
  error: boolean;
  body: {
    illust: {
      data: Array<{
        id?: string;
        title?: string;
        illustType?: number;
        xRestrict?: number;
        restrict?: number;
        sl?: number;
        url?: string;
        description?: string;
        tags?: Array<string>;
        userId?: string;
        userName?: string;
        width?: number;
        height?: number;
        pageCount?: number;
        isBookmarkable?: boolean;
        bookmarkData: unknown;
        alt?: string;
        titleCaptionTranslation?: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate?: string;
        updateDate?: string;
        isUnlisted?: boolean;
        isMasked?: boolean;
        profileImageUrl?: string;
        isAdContainer?: boolean;
      }>;
      total: number;
      bookmarkRanges: Array<{
        min?: number;
        max: unknown;
      }>;
    };
    popular: {
      recent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
      permanent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
    };
    relatedTags: Array<string>;
    tagTranslation: Array<unknown>;
    zoneConfig: {
      header: {
        url: string;
      };
      footer: {
        url: string;
      };
      infeed: {
        url: string;
      };
    };
    extraData: {
      meta: {
        title: string;
        description: string;
        canonical: string;
        alternateLanguages: {
          ja: string;
          en: string;
        };
        descriptionHeader: string;
      };
    };
  };
};

type Manga = {
  error: boolean;
  body: {
    manga: {
      data: Array<{
        id?: string;
        title?: string;
        illustType?: number;
        xRestrict?: number;
        restrict?: number;
        sl?: number;
        url?: string;
        description?: string;
        tags?: Array<string>;
        userId?: string;
        userName?: string;
        width?: number;
        height?: number;
        pageCount?: number;
        isBookmarkable?: boolean;
        bookmarkData: unknown;
        alt?: string;
        titleCaptionTranslation?: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate?: string;
        updateDate?: string;
        isUnlisted?: boolean;
        isMasked?: boolean;
        profileImageUrl?: string;
        isAdContainer?: boolean;
      }>;
      total: number;
      bookmarkRanges: Array<{
        min?: number;
        max: unknown;
      }>;
    };
    popular: {
      recent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
      permanent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
    };
    relatedTags: Array<string>;
    tagTranslation: Array<unknown>;
    zoneConfig: {
      header: {
        url: string;
      };
      footer: {
        url: string;
      };
      infeed: {
        url: string;
      };
    };
    extraData: {
      meta: {
        title: string;
        description: string;
        canonical: string;
        alternateLanguages: {
          ja: string;
          en: string;
        };
        descriptionHeader: string;
      };
    };
  };
};

type Novels = {
  error: boolean;
  body: {
    novel: {
      data: Array<{
        id: string;
        title: string;
        xRestrict: number;
        restrict: number;
        url: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        profileImageUrl: string;
        textCount: number;
        wordCount: number;
        readingTime: number;
        useWordCount: boolean;
        description: string;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        bookmarkCount: number;
        isOriginal: boolean;
        marker: unknown;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isMasked: boolean;
        isUnlisted: boolean;
        seriesId?: string;
        seriesTitle?: string;
      }>;
      total: number;
      bookmarkRanges: Array<{
        min?: number;
        max: unknown;
      }>;
    };
    relatedTags: Array<string>;
    tagTranslation: Array<unknown>;
    zoneConfig: {
      header: {
        url: string;
      };
      footer: {
        url: string;
      };
      infeed: {
        url: string;
      };
    };
    extraData: {
      meta: {
        title: string;
        description: string;
        canonical: string;
        alternateLanguages: {
          ja: string;
          en: string;
        };
        descriptionHeader: string;
      };
    };
  };
};

type Artworks = {
  error: boolean;
  body: {
    illustManga: {
      data: Array<{
        id?: string;
        title?: string;
        illustType?: number;
        xRestrict?: number;
        restrict?: number;
        sl?: number;
        url?: string;
        description?: string;
        tags?: Array<string>;
        userId?: string;
        userName?: string;
        width?: number;
        height?: number;
        pageCount?: number;
        isBookmarkable?: boolean;
        bookmarkData: unknown;
        alt?: string;
        titleCaptionTranslation?: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate?: string;
        updateDate?: string;
        isUnlisted?: boolean;
        isMasked?: boolean;
        profileImageUrl?: string;
        isAdContainer?: boolean;
      }>;
      total: number;
      bookmarkRanges: Array<{
        min?: number;
        max: unknown;
      }>;
    };
    popular: {
      recent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
      permanent: Array<{
        id: string;
        title: string;
        illustType: number;
        xRestrict: number;
        restrict: number;
        sl: number;
        url: string;
        description: string;
        tags: Array<string>;
        userId: string;
        userName: string;
        width: number;
        height: number;
        pageCount: number;
        isBookmarkable: boolean;
        bookmarkData: unknown;
        alt: string;
        titleCaptionTranslation: {
          workTitle: unknown;
          workCaption: unknown;
        };
        createDate: string;
        updateDate: string;
        isUnlisted: boolean;
        isMasked: boolean;
        profileImageUrl: string;
      }>;
    };
    relatedTags: Array<string>;
    tagTranslation: Array<unknown>;
    zoneConfig: {
      header: {
        url: string;
      };
      footer: {
        url: string;
      };
      infeed: {
        url: string;
      };
    };
    extraData: {
      meta: {
        title: string;
        description: string;
        canonical: string;
        alternateLanguages: {
          ja: string;
          en: string;
        };
        descriptionHeader: string;
      };
    };
  };
};
