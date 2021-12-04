interface illustsJSON {
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
  illust: Illust;
  manga: Illust;
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

interface Illust {
  data: PermanentElement[];
  total: number;
}

interface PermanentElement {
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
  seriesId?: string;
  seriesTitle?: string;
  isUnlisted: boolean;
}

interface Popular {
  recent: PermanentElement[];
  permanent: PermanentElement[];
}

interface ZoneConfig {
  header: Footer;
  footer: Footer;
  infeed: Footer;
}

interface Footer {
  url: string;
}

let count = 0;
async function getIllusts(url: string) {
  const response: illustsJSON = await (await fetch(url)).json();

  console.log(response.body);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.includes('https://www.pixiv.net/tags/')
  ) {
    //  console.log({ tabId, changeInfo, tab });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (
      details.url.includes('https://www.pixiv.net/ajax/search/') &&
      details.initiator === 'https://www.pixiv.net'
    ) {
      count += 1;
      getIllusts(details.url);
      console.log(details);
    }
  },
  { urls: ['https://www.pixiv.net/*'] }
);
