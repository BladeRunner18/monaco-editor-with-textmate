import { ProviderConfig, Grammars, Themes } from '@/types';
// import { merge } from 'lodash';

const base = `https://unpkg.com/monaco-editor-with-textmate@1.0.0/static/`;

const PresetGrammars: Grammars = {
  typescript: {
    scopeName: 'source.tsx',
    tm: `${base}textmate/typescriptReact.tmLanguage.json`,
    cfg: `${base}configuration/typescriptReactConfiguration.json`,
  },
  javascript: {
    scopeName: 'source.js',
    tm: `${base}textmate/javascript.tmLanguage.json`,
    cfg: `${base}configuration/javascriptConfiguration.json`,
  },
  css: {
    scopeName: 'source.css',
    tm: `${base}textmate/css.tmLanguage.json`,
    cfg: `${base}configuration/cssConfiguration.json`,
  },
  html: {
    scopeName: 'text.html.basic',
    tm: `${base}textmate/html.tmLanguage.json`,
    cfg: `${base}configuration/htmlConfiguration.json`,
  },
  json: {
    scopeName: 'source.json',
    tm: `${base}textmate/json.tmLanguage.json`,
    cfg: `${base}configuration/jsonConfiguration.json`,
  },
  vue: {
    scopeName: 'source.vue',
    tm: `${base}textmate/vue.tmLanguage.json`,
    cfg: `${base}configuration/vueConfiguration.json`,
    extra: {
      id: 'vue',
      extensions: ['.vue'],
      aliases: ['Vue', 'vue'],
    },
  },
};

const PresetThemes: Themes = {
  dracula: 'https://unpkg.com/monaco-editor-with-textmate@1.0.0/static/theme/dracula.json',
};
const config: ProviderConfig = {
  vs: 'https://unpkg.com/monaco-editor@0.36.1/min/vs',
  removePresetLanguageConfig: false,
  theme: 'dracula',
  wasm: 'https://unpkg.com/vscode-oniguruma@1.7.0/release/onig.wasm',
  grammars: PresetGrammars,
  themes: PresetThemes,
  useTextmate: false,
};

const setConfig = (cfg: Partial<ProviderConfig>) => {
  Object.assign(config, cfg);
  // merge(config, cfg);
};

const getConfig = () => config;

export { getConfig, setConfig };
