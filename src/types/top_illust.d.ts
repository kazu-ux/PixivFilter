interface TopIllust {
  error: boolean;
  message: string;
  body: Body;
}

interface Body {
  tagTranslation: { [key: string]: TagTranslation };
  thumbnails: Thumbnails;
  illustSeries: any[];
  requests: Request[];
  users: User[];
  page: Page;
  boothItems: BoothItem[];
  sketchLives: SketchLive[];
  zoneConfig: ZoneConfig;
}

interface BoothItem {
  id: string;
  userId: string;
  title: string;
  url: string;
  imageUrl: string;
  adult: boolean;
}

interface Page {
  tags: Tag[];
  follow: number[];
  mypixiv: any[];
  recommend: Recommend;
  recommendByTag: RecommendByTag[];
  ranking: Ranking;
  pixivision: Pixivision[];
  recommendUser: RecommendUser[];
  contestOngoing: ContestOngoing[];
  contestResult: ContestResult[];
  editorRecommend: EditorRecommend[];
  boothFollowItemIds: string[];
  sketchLiveFollowIds: any[];
  sketchLivePopularIds: string[];
  myFavoriteTags: any[];
  newPost: string[];
  trendingTags: TrendingTag[];
  completeRequestIds: string[];
  userEventIds: any[];
}

interface ContestOngoing {
  slug: string;
  type: Type;
  name: string;
  url: string;
  iconUrl: string;
  workIds: number[];
  isNew: boolean;
}

enum Type {
  Illust = 'illust',
  Novel = 'novel',
}

interface ContestResult {
  slug: string;
  type: Type;
  name: string;
  url: string;
  iconUrl: string;
  winnerWorkIds: number[];
}

interface EditorRecommend {
  illustId: string;
  comment: string;
}

interface Pixivision {
  id: string;
  title: string;
  thumbnailUrl: string;
  url: string;
}

interface Ranking {
  items: Item[];
  date: string;
}

interface Item {
  rank: string;
  id: string;
}

interface Recommend {
  ids: string[];
  details: { [key: string]: Detail };
}

interface Detail {
  methods: Method[];
  score: number;
  seedIllustIds: string[];
}

enum Method {
  BookmarkFreshCosTag = 'bookmark_fresh_cos_tag',
  ByTag = 'by_tag',
  ClusteringBqalgc = 'clustering_bqalgc',
  GenderRanking = 'gender_ranking',
  Search = 'search',
}

interface RecommendByTag {
  tag: string;
  ids: string[];
  details: { [key: string]: Detail };
}

interface RecommendUser {
  id: number;
  illustIds: string[];
  novelIds: any[];
}

interface Tag {
  tag: string;
  ids: number[];
}

interface TrendingTag {
  tag: string;
  trendingRate: number;
  ids: number[];
}

interface Request {
  requestId: string;
  planId: string;
  fanUserId: null | string;
  creatorUserId: string;
  requestStatus: RequestStatus;
  requestPostWorkType: Type;
  requestPrice: number;
  requestProposal: RequestProposal;
  requestTags: string[];
  requestAdultFlg: boolean;
  requestAnonymousFlg: boolean;
  requestRestrictFlg: boolean;
  requestAcceptCollaborateFlg: boolean;
  requestResponseDeadlineDatetime: Date;
  requestPostDeadlineDatetime: Date;
  role: Role;
  collaborateStatus: CollaborateStatus;
  postWork: PostWork;
}

interface CollaborateStatus {
  collaborating: boolean;
  collaborateAnonymousFlg: boolean;
  collaboratedCnt: number;
  collaborateUserSamples: CollaborateUserSample[];
}

interface CollaborateUserSample {
  collaborateUserId: string;
  collaborateAnonymousFlg: boolean;
}

interface PostWork {
  postWorkId: string;
  postWorkType: Type;
  work: Work;
}

interface Work {
  isUnlisted: boolean;
  secret: null;
}

interface RequestProposal {
  requestOriginalProposal: string;
  requestOriginalProposalHtml: string;
  requestOriginalProposalLang: RequestProposalLang;
  requestTranslationProposal: RequestTranslationProposal[];
}

enum RequestProposalLang {
  En = 'en',
  Ja = 'ja',
}

interface RequestTranslationProposal {
  requestProposal: string;
  requestProposalHtml: string;
  requestProposalLang: RequestProposalLang;
}

enum RequestStatus {
  Complete = 'complete',
}

enum Role {
  Others = 'others',
}

interface SketchLive {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  audienceCount: number;
  isR18: boolean;
  streamerIds: number[];
}

interface TagTranslation {
  romaji: string;
}

interface Thumbnails {
  illust: Illust[];
  novel: Novel[];
  novelSeries: any[];
  novelDraft: any[];
}

interface Illust {
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
  urls: Urls;
  profileImageUrl: string;
  seriesId?: string;
  seriesTitle?: string;
}

interface TitleCaptionTranslation {
  workTitle: null;
  workCaption: null;
}

interface Urls {
  '250x250': string;
  '360x360': string;
  '540x540': string;
}

interface Novel {
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
  isUnlisted: boolean;
  seriesId?: string;
  seriesTitle?: string;
}

interface User {
  userName: any;
  partial: number;
  comment: string;
  followedBack: boolean;
  userId: string;
  name: string;
  image: string;
  imageBig: string;
  premium: boolean;
  isFollowed: boolean;
  isMypixiv: boolean;
  isBlocking: boolean;
  background: null;
  acceptRequest: boolean;
}

interface ZoneConfig {
  logo: Comic;
  header: Comic;
  footer: Comic;
  topbranding_rectangle: Comic;
  comic: Comic;
  illusttop_appeal: Comic;
}

interface Comic {
  url: string;
}
