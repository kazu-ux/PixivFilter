import React from 'react';
import { ChromeStorage } from '../../utils/chrome_storage';

const onClick = async (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  console.log(event);

  // 書き込む関数
  const writeFile = async (
    handle: FileSystemFileHandle,
    content: FileSystemWriteChunkType
  ) => {
    // writableを作成
    const writable = await handle.createWritable();

    // コンテントを書き込む
    await writable.write(content);

    // ファイルを閉じる
    await writable.close();
  };

  // 保存しているNGリストを取得する
  const blockUsers = await ChromeStorage.getBlockUsers();
  const blockTags = await ChromeStorage.getBlockTags();

  try {
    const handle = await window.showSaveFilePicker({
      types: [
        {
          description: 'Json file',
          accept: { 'application/json': ['.json'] },
        },
      ],
      suggestedName: 'block_list.json',
    });
    await writeFile(handle, JSON.stringify({ blockUsers, blockTags }));
    console.log(blockUsers);
  } catch (error) {
    console.log(error);
  }
};

const ExportBotton = () => {
  return (
    <button className='export-button' onClick={onClick}>
      export
    </button>
  );
};

export default ExportBotton;
