const setRequestFlag = async (requestFlag: boolean) => {
  await chrome.storage.local.set({ requestFlag });
  return;
};

const getRequestFlag: () => Promise<boolean> = async () => {
  return (await chrome.storage.local.get('requestFlag')).requestFlag;
};

//ユーザーをストレージに保存する
const setBlockUser = async (userData: UserData) => {
  const savedUsers = await ChromeStorage.getBlockUser();

  if (!savedUsers) {
    await chrome.storage.local.set({ blockUsers: [userData] });
    console.log('空っぽ');
    return;
  }

  const newUsers = savedUsers.concat(userData);

  await chrome.storage.local.set({ blockUsers: newUsers });
  return;
};

// ストレージからNGユーザーを取得する
const getBlockUser = async () => {
  const savedUsers: UserData[] | undefined = (
    await chrome.storage.local.get('blockUsers')
  ).blockUsers;
  if (!savedUsers) {
    return [];
  }

  return savedUsers;
};

// ストレージからユーザーを削除する
const removeUser = async (Users: UserData[]) => {
  const userIds: string[] = Users.map((user) => user.userId);

  const sevedUsers = await ChromeStorage.getBlockUser();
  if (!sevedUsers) return [];

  const newUsers = sevedUsers
    .map((user) => {
      if (!userIds.includes(user.userId)) {
        return user;
      }
    })
    .filter(Boolean)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  await chrome.storage.local.set({ blockUsers: newUsers });

  console.log(newUsers);
  return newUsers;
};

const setWorksData = async (worksData: WorkData[]) => {
  await chrome.storage.local.set({ worksData });
  return;
};

const getWorksData: () => Promise<WorkData[]> = async () => {
  return (await chrome.storage.local.get('worksData')).worksData;
};

const getWorkTags = async (workId: string): Promise<string[]> => {
  const worksData = await getWorksData();
  const targetTags = worksData.find((e) => e.id === workId)?.tags ?? [];
  return targetTags;
};

const setBlockTag = async (tag: string) => {
  const savedTags = await ChromeStorage.getBlockTags();
  console.log(savedTags);

  if (!savedTags) {
    await chrome.storage.local.set({ blockTags: [tag] });
    console.log('空っぽ');
    return;
  }

  const newTags = savedTags.concat(tag);
  console.log(newTags);

  await chrome.storage.local.set({ blockTags: newTags });
  return;
};

const getBlockTags = async () => {
  const savedTags: string[] | undefined = (
    await chrome.storage.local.get('blockTags')
  ).blockTags;

  if (!savedTags) return [];
  return savedTags;
};

const removeTags = async (blockTags: string[]) => {
  const savedTags = await ChromeStorage.getBlockTags();
  if (!savedTags) return [];

  const newTags = savedTags
    .map((tag) => {
      if (!blockTags.includes(tag)) {
        return tag;
      }
    })
    .filter(Boolean)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  await chrome.storage.local.set({ blockTags: newTags });

  console.log(newTags);
  return newTags;
};

export const ChromeStorage = {
  setRequestFlag,
  getRequestFlag,
  getBlockUser,
  setBlockUser,
  removeUser,
  setWorksData,
  getWorksData,
  getWorkTags,
  setBlockTag,
  getBlockTags,
  removeTags,
};
