const setRequestFlag = async (requestFlag: boolean) => {
  await chrome.storage.local.set({ requestFlag });
  return;
};

const getRequestFlag: () => Promise<boolean> = async () => {
  return (await chrome.storage.local.get('requestFlag')).requestFlag;
};

const setConfig = async (config: Config) => {
  await chrome.storage.local.set({
    blockUsers: config.blockUsers,
    blockTags: config.blockTags,
  });
  return;
};

//ユーザーをストレージに保存する
const setBlockUser = async (userData: BlockUser) => {
  const savedUsers = await ChromeStorage.getBlockUsers();

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
const getBlockUsers = async () => {
  const savedUsers: BlockUser[] | undefined = (
    await chrome.storage.local.get('blockUsers')
  ).blockUsers;
  if (!savedUsers) {
    return [];
  }

  return savedUsers;
};

// ストレージからユーザーを削除する
const removeBlockUser = async (Users: BlockUser[]) => {
  const userIds: string[] = Users.map((user) => user.userId);

  const sevedUsers = await ChromeStorage.getBlockUsers();
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

const setWorksData = async (worksData: WorksData) => {
  await chrome.storage.local.set({ worksData });
  return;
};

const getWorksData: () => Promise<WorksData> = async () => {
  return (await chrome.storage.local.get('worksData')).worksData;
};

const addBlockTag = async (tag: string) => {
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

const removeBlockTags = async (blockTags: string[]) => {
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
  // setRequestFlag,
  // getRequestFlag,
  setConfig,
  getBlockUsers,
  setBlockUser,
  removeBlockUser,
  // setWorksData,
  // getWorksData,
  addBlockTag,
  getBlockTags,
  removeBlockTags,
};
