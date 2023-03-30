import { IGrammar } from '@/types';

const base = `https://unpkg.com/monaco-editor-with-textmate@1.0.0/static/`;

export const PresetGrammars: Record<string, IGrammar> = {
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
