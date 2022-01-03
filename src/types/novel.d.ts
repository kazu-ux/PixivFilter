interface Novel {
  error: boolean;
  body: Body;
}

interface Body {
  novel: NovelClass;
  relatedTags: string[];
  tagTranslation: any[];
  zoneConfig: ZoneConfig;
  extraData: ExtraData;
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

interface NovelClass {
  data: Datum[];
  total: number;
  bookmarkRanges: BookmarkRange[];
}

interface BookmarkRange {
  min: number | null;
  max: null;
}

interface Datum {
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
  seriesId?: string;
  seriesTitle?: string;
  isUnlisted: boolean;
}

interface TitleCaptionTranslation {
  workTitle: null;
  workCaption: null;
}

interface ZoneConfig {
  header: Footer;
  footer: Footer;
  infeed: Footer;
}

interface Footer {
  url: string;
}
