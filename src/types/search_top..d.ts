interface SearchTop {
  error: boolean;
  body: Body;
}

interface Body {
  novel: Novel;
  popular: Popular;
  relatedTags: string[];
  tagTranslation: any[];
  zoneConfig: ZoneConfig;
  extraData: ExtraData;
  illustManga: IllustManga;
}

interface ExtraData {
  meta: Meta;
}

interface Meta {
  title: string;
  description: string;
  canonical: string;
  alternateLanguages: AlternateLanguages;
  descriptionHeader: string;
}

interface AlternateLanguages {
  ja: string;
  en: string;
}

interface IllustManga {
  data: IllustMangaDatum[];
  total: number;
}

interface IllustMangaDatum {
  id: string;
  title: string;
  illustType: number;
  xRestrict: number;
  restrict: number;
  sl: number;
  url: string;
  description: string;
  tags: string[];
  userId: string;
  userName: string;
  width: number;
  height: number;
  pageCount: number;
  isBookmarkable: boolean;
  bookmarkData: null;
  alt: string;
  titleCaptionTranslation: TitleCaptionTranslation;
  createDate: Date;
  updateDate: Date;
  isUnlisted: boolean;
  isMasked: boolean;
  profileImageUrl: string;
}

interface TitleCaptionTranslation {
  workTitle: null;
  workCaption: null;
}

interface Novel {
  data: NovelDatum[];
  total: number;
}

interface NovelDatum {
  id: string;
  title: string;
  xRestrict: number;
  restrict: number;
  url: string;
  tags: string[];
  userId: string;
  userName: string;
  profileImageUrl: string;
  textCount: number;
  description: string;
  isBookmarkable: boolean;
  bookmarkData: null;
  bookmarkCount: number;
  isOriginal: boolean;
  marker: null;
  titleCaptionTranslation: TitleCaptionTranslation;
  createDate: Date;
  updateDate: Date;
  isMasked: boolean;
  seriesId: string;
  seriesTitle: string;
  isUnlisted: boolean;
}

interface Popular {
  recent: any[];
  permanent: any[];
}

interface ZoneConfig {
  header: Footer;
  footer: Footer;
  infeed: Footer;
}

interface Footer {
  url: string;
}
