import { WorksStyle } from '../works_style';
import SearchPage from './search_page';
import './styles/style.css';

export default defineContentScript({
  matches: ['https://www.pixiv.net/*'],
  runAt: 'document_start',

  main(ctx) {
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', chrome.runtime.getURL('filter.js'));
    script.addEventListener('load', () => {
      console.log('load');
    });

    const head =
      document.head ||
      document.getElementsByTagName('head')[0] ||
      document.documentElement;
    head.insertBefore(script, head.lastChild);
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   SearchPage();
    //   chrome.runtime.sendMessage(WorksStyle.visible);
    // });
  },
});
