interface Config {
  blockTags: string[];
  blockUsers: BlockUser[];
}

interface BlockUser {
  userId: string;
  userName: string;
}
