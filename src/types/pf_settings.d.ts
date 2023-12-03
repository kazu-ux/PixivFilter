// Pixiv Filterの設定モデル
type PFSettings = {
  blockTags: string[];
  blockUsers: UserData[];
  headers: [];
  requestFlag: boolean;
  worksData: WorkData[];
};
