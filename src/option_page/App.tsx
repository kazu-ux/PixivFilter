import { Suspense } from 'react';
import './App.css';
import { BlockUser } from './components/Block_user';
import { BlockTag } from './components/Block_tag';
import './option_page.css';
import ExportButton from './components/export_button';
import ImportButton from './components/import_button';

function App() {
  return (
    <div className="App">
      <Suspense fallback={<span>waiting...</span>}>
        <BlockUser />
        <BlockTag />
      </Suspense>
      <div className="import-export-buttons">
        <ExportButton />
        <ImportButton />
      </div>
    </div>
  );
}

export default App;
