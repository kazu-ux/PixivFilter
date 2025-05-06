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
    if (!(error instanceof TypeError)) return;

    function downloadFile(
      content: BlobPart,
      fileName: string,
      contentType: string = 'application/octet-stream'
    ) {
      // 1. Blobの作成
      const blob = new Blob([content], { type: contentType || 'text/plain' });

      // 2. オブジェクトURLの生成
      const url = URL.createObjectURL(blob);

      // 3. ダウンロードリンクの作成
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download.txt'; // download属性にファイル名を設定

      // link.style.display = 'none'; // 画面に表示する必要はない
      // document.body.appendChild(link); // DOMに追加する必要がある場合もある

      // 4. ダウンロードの実行
      link.click();

      // 5. 後片付け (少し遅延させて実行するのが安全な場合がある)
      setTimeout(() => {
        URL.revokeObjectURL(url);
        // if (link.parentNode) { // DOMに追加した場合
        //   link.parentNode.removeChild(link);
        // }
      }, 100);

      console.log(`ファイル "${fileName}" のダウンロードを開始しました。`);
    }

    downloadFile(
      JSON.stringify({ blockUsers, blockTags }),
      'block_list.json',
      'application/json'
    );

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
