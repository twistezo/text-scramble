import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier/flat'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import ts from 'typescript-eslint'

export default defineConfig([
  js.configs.recommended,
  ts.configs.recommended,
  prettierConfig,
  prettierPluginRecommended,
  perfectionist.configs['recommended-natural'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
    },
  },
  {
    extends: ['js/recommended'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.node },
    plugins: { js },
  },
  tseslint.configs.recommended,
])
