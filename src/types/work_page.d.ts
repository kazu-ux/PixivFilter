interface WorkPage {
  error: boolean;
  message: string;
  body: Body;
}

interface Body {
  illustId: string;
  illustTitle: string;
  illustComment: string;
  id: string;
  title: string;
  description: string;
  illustType: number;
  createDate: Date;
  uploadDate: Date;
  restrict: number;
  xRestrict: number;
  sl: number;
  urls: Urls;
  tags: Tags;
  alt: string;
  storableTags: string[];
  userId: string;
  userName: string;
  userAccount: string;
  userIllusts: { [key: string]: UserIllust | null };
  likeData: boolean;
  width: number;
  height: number;
  pageCount: number;
  bookmarkCount: number;
  likeCount: number;
  commentCount: number;
  responseCount: number;
  viewCount: number;
  bookStyle: number;
  isHowto: boolean;
  isOriginal: boolean;
  imageResponseOutData: any[];
  imageResponseData: any[];
  imageResponseCount: number;
  pollData: null;
  seriesNavData: null;
  descriptionBoothId: null;
  descriptionYoutubeId: null;
  comicPromotion: null;
  fanboxPromotion: null;
  contestBanners: any[];
  isBookmarkable: boolean;
  bookmarkData: null;
  contestData: null;
  zoneConfig: ZoneConfig;
  extraData: ExtraData;
  titleCaptionTranslation: TitleCaptionTranslation;
  isUnlisted: boolean;
  request: null;
  commentOff: number;
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
  ogp: Ogp;
  twitter: Ogp;
}

interface AlternateLanguages {
  ja: string;
  en: string;
}

interface Ogp {
  description: string;
  image: string;
  title: string;
  type?: string;
  card?: string;
}

interface Tags {
  authorId: string;
  isLocked: boolean;
  tags: Tag[];
  writable: boolean;
}

interface Tag {
  tag: string;
  locked: boolean;
  deletable: boolean;
  userId?: string;
  userName?: string;
}

interface TitleCaptionTranslation {
  workTitle: null;
  workCaption: null;
}

interface Urls {
  mini: string;
  thumb: string;
  small: string;
  regular: string;
  original: string;
}

interface UserIllust {
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
  profileImageUrl?: string;
}

interface ZoneConfig {
  responsive: The500_X500;
  rectangle: The500_X500;
  '500x500': The500_X500;
  header: The500_X500;
  footer: The500_X500;
  expandedFooter: The500_X500;
  logo: The500_X500;
  relatedworks: The500_X500;
}

interface The500_X500 {
  url: string;
}
