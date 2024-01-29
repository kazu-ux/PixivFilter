import { createRoot } from 'react-dom/client';
import App from './app';

// debounce関数の定義
const debounce = (func: () => void, wait: number) => {
  let timeout: number | undefined;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
};

// MutationObserverのインスタンス作成
const observer = new MutationObserver(
  debounce(async () => {
    // DOM変更が検出されたときの処理
    const url = window.location.href;
    if (!url.includes('https://www.pixiv.net/tags/')) return;

    console.log(url);
    if (document.querySelector('#pf_root')) return;
    const TargetElements = document.querySelectorAll('section');

    try {
      TargetElements[1].innerHTML = '<div id="pf_root"></div>';
    } catch (error) {
      TargetElements[0].innerHTML = '<div id="pf_root"></div>';
    }

    const root = createRoot(document.getElementById('pf_root')!);
    root.render(<App />);
    console.log('root作成');
  }, 500)
);

// 監視対象の要素を取得
const target = document.querySelector('body')!;

// 監視オプションを設定
const config = { childList: true, subtree: true, attributes: true };

// 監視開始
observer.observe(target, config);
// SearchPage();

chrome.runtime.onMessage.addListener((userUrl, sender, sendResponse) => {
  const pathname = new URL(userUrl).pathname;
  const userElements = document.querySelectorAll(`a[href="${pathname}"]`);
  const userName = Array.from(userElements).find((element) => {
    return element.textContent;
  })?.textContent;
  console.log(pathname, userName);

  if (!userName) {
    return;
  }
  const userId = pathname.split('/')[2];
  console.log(userName, userId);
});
