type User = { userId: string; userName: string };
type Users = User[];
type Tag = string;
type Tags = Tag[];
type UserOrTag = {
  userKey?: Users;
  tagName?: Tags;
};

type WorksData = {
  id: string;
  title: string;
  tags: string[];
  userId: string;
  userName: string;
  url: string; // サムネイル画像のURL
  profileImageUrl: string; // ユーザーアイコン画像のURL
}[];

type NGObject =
  | {}
  | {
      tagName: string[];
      userKey: { userId: string; uerName: string }[];
    };

type ClickedWorksData =
  | {
      userName: string;
      userId: string;
    }
  | {
      tagName: string;
    };
