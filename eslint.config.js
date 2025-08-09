import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Global ignores, equivalent to `ignorePatterns`
  globalIgnores(['dist', '.eslintrc.cjs']),

  // Main configuration object for JS/JSX files
  {
    files: ['**/*.{js,jsx}'],
    
    // 1. Plugins are now defined here
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    
    // 2. Language and parser options are grouped in `languageOptions`
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
      ecmaVersion: 2020,
    },
    
    // 3. Settings are now at the top level of the config object
    settings: {
      react: {
        // 'detect' is the modern best practice, automatically finding the version
        version: 'detect',
      },
    },

    // 4. All rules are merged into a single `rules` object
    rules: {
      // Rules from your OLD config
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-target-blank': 'off',
      
      // Rules from your NEW config and hooks
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]);