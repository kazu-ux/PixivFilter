import { ChromeStorage } from '@/entrypoints/utils/chrome_storage';
import React from 'react';
import { importStr } from '../locales/locales';

const ExportBotton = () => {
  const [active, setActive] = React.useState(true);

  const onClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setActive(false);

    try {
      const handle = (
        await window.showOpenFilePicker({
          types: [
            {
              description: 'Json file',
              accept: { 'application/json': ['.json'] },
            },
          ],
        })
      )[0];
      const file = await handle.getFile();
      const text = await file.text();
      const config: any = JSON.parse(text);
      if (!(config.blockUsers && config.blockTags)) {
        setActive(true);
        alert('error');
        return;
      }
      await ChromeStorage.setConfig(config as Config);
      setActive(true);
      location.reload();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setActive(true);
          // alert('error');
          return;
        }
        if (error.name === 'SyntaxError') {
          setActive(true);
          alert('error');
          return;
        }
      }

      const inputFileElement = document.createElement('input');
      inputFileElement.type = 'file';
      inputFileElement.multiple = false;
      inputFileElement.accept = '.json';
      inputFileElement.click();

      inputFileElement.addEventListener('cancel', () => {
        console.log('cancel');
        setActive(true);
      });
      inputFileElement.addEventListener('change', async () => {
        setActive(true);

        try {
          const file = inputFileElement.files?.[0];
          if (!file) return;
          const text = await file.text();
          const config: any = JSON.parse(text);
          if (!(config.blockUsers && config.blockTags)) {
            setActive(true);
            alert('error');
            return;
          }
          await ChromeStorage.setConfig(config as Config);
          location.reload();
        } catch (error) {
          if (error instanceof SyntaxError) {
            setActive(true);
            alert('error');
            return;
          }
        }
      });
    }
  };

  return (
    <button className='import-button' onClick={onClick} disabled={!active}>
      {active ? importStr : 'loading...'}
    </button>
  );
};

export default ExportBotton;
