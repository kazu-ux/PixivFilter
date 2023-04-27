import React, { ReactElement, useEffect } from 'react';

import { useAtom } from 'jotai';
import { worksDataAtom } from './atoms/atoms';
import { ChromeStorage } from './database/chrome_storage';
import WorkList from './components/work_list';

const sampleData: WorkData = {
  id: '88021292',
  title: 'よく抜いてる画像集',
  illustType: 0,
  xRestrict: 0,
  restrict: 0,
  sl: 4,
  url: 'https://i.pximg.net/c/250x250_80_a2/img-master/img/2021/02/24/19/59/34/88021292_p0_square1200.jpg',
  description: '',
  tags: ['エロ', 'あかさたなはまやらわ', 'abcdefg???'],
  userId: '59085265',
  userName: '利 砂',
  width: 1280,
  height: 720,
  pageCount: 10,
  isBookmarkable: true,
  bookmarkData: null,
  alt: '#エロ よく抜いてる画像集 - 利 砂のイラスト',
  titleCaptionTranslation: {
    workTitle: null,
    workCaption: null,
  },
  createDate: '2021-02-24T19:59:34+09:00',
  updateDate: '2021-02-24T19:59:34+09:00',
  isUnlisted: false,
  isMasked: false,

  profileImageUrl: 'https://s.pximg.net/common/images/no_profile_s.png',
};

function App() {
  const [worksData, setWorksData] = useAtom(worksDataAtom);

  useEffect(() => {
    (async () => {
      const worksData = await ChromeStorage.getWorksData();
      setWorksData(worksData);
      chrome.storage.local.onChanged.addListener((changes) => {
        if (changes.worksData) {
          setWorksData(changes.worksData.newValue);
        }
      });
    })();
  }, []);
  return (
    <div className="App">
      <WorkList></WorkList>
    </div>
  );
}

export default App;
