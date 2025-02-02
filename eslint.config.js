import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import emotionPlugin from 'eslint-plugin-emotion';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: { react: { version: 'detect' } },
  },
  // Global language options
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  // Core JavaScript & TypeScript configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // React configurations
  pluginReact.configs.flat.recommended,
  pluginReactJSXRuntime,
  // Styling configurations
  emotionPlugin,
];
