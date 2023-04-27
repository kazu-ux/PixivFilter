import { createRoot } from 'react-dom/client';
import { SearchPage } from './content_scripts/search_page';
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
    const TargetElement = document.querySelector('section');
    if (!TargetElement) return;

    TargetElement.innerHTML = '<div id="pf_root"></div>';
    /*     const rootElement = document.createElement('div');
    rootElement.id = 'pf_root'; */

    const root = createRoot(document.getElementById('pf_root')!);
    root.render(<App></App>);

    // document.querySelector('body')?.before(createWatchButton());
  }, 100)
);

// 監視対象の要素を取得
const target = document.querySelector('body')!;

// 監視オプションを設定
const config = { childList: true, subtree: true, attributes: true };

// 監視開始
observer.observe(target, config);
// SearchPage();
