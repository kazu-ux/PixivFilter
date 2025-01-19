import { ChromeStorage } from './utils/chrome_storage';
import { WorksStyle } from './works_style';

export default defineBackground(() => {
  console.log('background.ts');

  chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
  });
});
