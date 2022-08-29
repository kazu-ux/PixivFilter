import SearchPage from './content_scripts/search_page';

chrome.runtime.onMessage.addListener(() => {
  SearchPage();
});

chrome.runtime.sendMessage('');

let href = location.href;
const observer = new MutationObserver(() => {
  if (href !== location.href) {
    chrome.runtime.sendMessage('');
    href = location.href;
  }
});

observer.observe(document, { childList: true, subtree: true });

export {};
