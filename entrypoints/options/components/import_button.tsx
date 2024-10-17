import React from 'react';

const onClick = async (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  console.log(event);

  try {
    const handle = (
      await window.showOpenFilePicker({
        types: [
          {
            description: 'Json file',
            accept: { 'application/json': ['.json'] },
          },
        ],
      })
    )[0];
    const file = await handle.getFile();
    const text = await file.text();
    const blockObject: any = JSON.parse(text);
    if (blockObject.tagName) {
      chrome.storage.local.set({ blockTags: blockObject.tagName });
    }
    if (blockObject.userKey) {
      chrome.storage.local.set({ blockUsers: blockObject.userKey });
    }
    if (blockObject.tagName || blockObject.userKey) {
      location.reload();
      return;
    }

    const blockUsers = blockObject.blockUsers;
    const blockTags = blockObject.blockTags;
    if (!blockUsers) return alert('error');
    if (!blockTags) return alert('error');

    chrome.storage.local.set({ blockUsers });
    chrome.storage.local.set({ blockTags });
    location.reload();
  } catch (error) {
    console.log(error);
  }
};

const ExportBotton = () => {
  return (
    <button className="import-button" onClick={onClick}>
      import
    </button>
  );
};

export default ExportBotton;
