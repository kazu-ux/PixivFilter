export default async () => {
  console.log('ストレージをチェック');

  const blockUsers: { userId: string; userName: string }[] | undefined = (
    await chrome.storage.local.get('blockUsers')
  ).blockUsers;
  const blockTags: string[] | undefined = (
    await chrome.storage.local.get('blockTags')
  ).blockTags;

  if (blockUsers || blockTags) return console.log('移行の必要なし');
  console.log('古いストレージを検索します');

  const tagNames: string[] | undefined = (
    await chrome.storage.local.get('tagName')
  ).tagName;
  if (tagNames) {
    await chrome.storage.local.set({ blockTags: tagNames });
  }

  const userKey: { userId: string; userName: string }[] | undefined = (
    await chrome.storage.local.get('userKey')
  ).userKey;
  if (userKey) {
    await chrome.storage.local.set({ blockUsers: userKey });
  }
  if (!tagNames && !userKey) {
    console.log('ストレージは空です');
    return;
  }
  console.log('ストレージを移行しました');
};
