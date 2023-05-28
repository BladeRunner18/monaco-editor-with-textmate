import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// declare const monaco: monaco;

export type M = typeof monaco;

export interface ProviderConfig {
  /**
   * set the monaco-editor loader path
   * @default https://unpkg.com/monaco-editor@0.36.1/min/vs
   */
  vs: string;

  /**
   * remove the preset config
   * monaco-editor use Monarch, we change it to Textmate
   * then we do not need the preset configuration
   * @default true
   */
  removePresetLanguageConfig: boolean;

  /**
   * set the default theme
   * note: you should register theme before use it
   * @default 'dracula'
   */
  theme: string;

  /**
   * set the onig.wasm url to load;
   * @default https://unpkg.com/vscode-oniguruma@1.7.0/release/onig.wasm
   */
  wasm: string;

  /**
   * set grammars config
   */
  grammars: Grammars;

  /**
   * set theme config
   */
  themes: ITheme;

  useTextmate: boolean;
}

export type Grammars = Record<string, GrammarItem>;

export interface GrammarItem {
  /**
   * textmate scopeName
   */
  scopeName: string;

  /**
   * textmate config url
   * example: https://unpkg.com/monaco-editor-with-textmate@1.0.0/static/textmate/typescriptReact.tmLanguage.json
   */
  tm: string;

  /**
   * language config url
   * example: https://unpkg.com/monaco-editor-with-textmate@1.0.0/static/configuration/typescriptReactConfiguration.json
   */
  cfg?: string;

  /**
   * if the language you provider that monaco-editor does not include such as vue、svelte..
   * you need pass the extra and we will register to the monaco-editor;
   *
   */
  extra?: monaco.languages.ILanguageExtensionPoint;
}

export type Themes = Record<string, string>;

export { monaco };
