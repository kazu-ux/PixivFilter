import SearchPage from './content_scripts/search_page';
import './css/style.css';

chrome.runtime.onMessage.addListener(() => {
  SearchPage();
});

chrome.runtime.sendMessage(true);

let href = location.href;
const observer = new MutationObserver(() => {
  if (href !== location.href) {
    const isSearchPage = location.href.includes('/tags/');

    console.log(location.href);

    chrome.runtime.sendMessage(isSearchPage);
    href = location.href;
  }
});

observer.observe(document, { childList: true, subtree: true });

export {};
