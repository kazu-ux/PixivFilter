import { ChromeStorage } from '../../database/chrome_storage';

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
      ChromeStorage.setBlockTag(blockObject.tagName);
    }
    if (blockObject.userKey) {
      ChromeStorage.setBlockUser(blockObject.userKey);
    }
    if (blockObject.tagName || blockObject.userKey) {
      location.reload();
      return;
    }

    const blockUsers = blockObject.blockUsers;
    const blockTags = blockObject.blockTags;
    if (!blockUsers) return alert('error');
    if (!blockTags) return alert('error');

    ChromeStorage.setBlockUser(blockUsers);
    ChromeStorage.setBlockTag(blockTags);
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
