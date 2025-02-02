import { ChromeStorage } from './utils/chrome_storage';
import { WorksStyle } from './works_style';

export default defineBackground(() => {
  console.log('background.ts');

  const browserType = import.meta.env.BROWSER;

  switch (browserType) {
    case 'chrome':
      console.log(import.meta.env.CHROME);
      chrome.action.onClicked.addListener(() => {
        chrome.runtime.openOptionsPage();
      });
      break;
    case 'firefox':
      console.log(import.meta.env.FIREFOX);
      browser.browserAction.onClicked.addListener(() => {
        browser.runtime.openOptionsPage();
      });
      break;
    default:
      console.log(import.meta.env.BROWSER);
  }
});
