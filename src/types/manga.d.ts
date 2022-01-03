interface Manga {
  error: boolean;
  body: Body;
}

interface Body {
  manga: MangaClass;
  popular: Popular;
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

interface MangaClass {
  data: Datum[];
  total: number;
  bookmarkRanges: BookmarkRange[];
}

interface BookmarkRange {
  min: number | null;
  max: null;
}

interface Datum {
  id?: string;
  title?: string;
  illustType?: number;
  xRestrict?: number;
  restrict?: number;
  sl?: number;
  url?: string;
  description?: string;
  tags?: string[];
  userId?: string;
  userName?: string;
  width?: number;
  height?: number;
  pageCount?: number;
  isBookmarkable?: boolean;
  bookmarkData?: null;
  alt?: string;
  titleCaptionTranslation?: TitleCaptionTranslation;
  createDate?: Date;
  updateDate?: Date;
  isUnlisted?: boolean;
  isMasked?: boolean;
  profileImageUrl?: string;
  isAdContainer?: boolean;
}

interface TitleCaptionTranslation {
  workTitle: null;
  workCaption: null;
}

interface Popular {
  recent: Datum[];
  permanent: Datum[];
}

interface ZoneConfig {
  header: Footer;
  footer: Footer;
  infeed: Footer;
}

interface Footer {
  url: string;
}
