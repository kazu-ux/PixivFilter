import { WorksStyle } from '../works_style';
import SearchPage from './search_page';
import './styles/style.css';

export default defineContentScript({
  matches: ['https://www.pixiv.net/*'],
  runAt: 'document_start',

  main(ctx) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      SearchPage();
      chrome.runtime.sendMessage(WorksStyle.visible);
    });
  },
});
