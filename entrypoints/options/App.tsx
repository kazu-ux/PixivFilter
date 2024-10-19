import { Suspense } from 'react';
import { BlockTag } from './components/Block_tag';
import { BlockUser } from './components/Block_user';
import ExportButton from './components/export_button';
import ImportButton from './components/import_button';

import './option_page.css';

function IndexPopup() {
  return (
    <div className='App'>
      <Suspense fallback={<span>waiting...</span>}>
        <BlockUser />
        <BlockTag />
      </Suspense>

      <div className='import-export-buttons'>
        <ExportButton />
        <ImportButton />
      </div>
    </div>
  );
}

export default IndexPopup;
