import SearchPage from './content_scripts/search_page';
import './css/style.css';
import { WorksStyle } from './works_style';

chrome.runtime.onMessage.addListener(() => {
  SearchPage();
});

chrome.runtime.sendMessage('');

let href = location.href;

const observer = new MutationObserver(() => {
  if (href === location.href) return;

  const isSearchPage = location.href.includes('/tags/');
  if (!isSearchPage) {
    chrome.runtime.sendMessage(WorksStyle.visible);
  }
  href = location.href;
});

observer.observe(document, { childList: true, subtree: true });

export {};
