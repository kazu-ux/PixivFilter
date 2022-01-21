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
  tags: string[];
  userId: string;
  userName: string;
  url: string;
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
