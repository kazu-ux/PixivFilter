export interface NoAdWorks {
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

export interface TitleCaptionTranslation {
  workTitle: null;
  workCaption: null;
}
