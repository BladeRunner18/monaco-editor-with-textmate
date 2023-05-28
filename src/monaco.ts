import { getConfig } from '@/config';
import LanguageProvider from './provider/LanguageProvider';
import ThemeProvider from './provider/ThemeProvider';
import EventEmitter from '@/util/EventEmitter';
import { monaco, M } from '@/types';

enum Status {
  'UNLOAD' = 0,
  'PEDDING' = 1,
  'LOADED' = 2,
}

let status = Status.UNLOAD;
const event = new EventEmitter();
let themeProvider: ThemeProvider;

async function injectMonacoLoader() {
  if (window.monaco) return;
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${getConfig().vs}/loader.js`;
    document.body.appendChild(script);
    script.onload = () => {
      window.require.config({
        paths: { vs: getConfig().vs },
      });
      resolve('');
    };

    script.onerror = (err) => {
      console.error('Inject monaco loader failed');
      reject(err);
    };
  });
}

async function loadEditor() {
  return new Promise((resolve, reject) => {
    window.require(['vs/editor/editor.main'], (monaco: M) => {
      resolve(monaco);
    });
  });
}

function removePresetLanguageProvider() {
  const languages = ['javascript', 'typescript', 'html', 'css', 'json'];
  for (const languageId of languages) {
    window.monaco.languages.registerTokensProviderFactory(languageId, {} as any).dispose();
    window.monaco.languages.onLanguage(languageId, () => {}).dispose();
  }
}

function setTypescriptConfig() {
  // window.monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  //   allowJs: true,
  //   experimentalDecorators: true,
  //   jsxFactory: 'React.createElement',
  //   module: 1,
  //   jsx: 2,
  //   noEmit: true,
  //   moduleResolution: 2,
  //   target: 2,
  // });
  // TODO
  // window.monaco.languages.typescript.typescriptDefaults.setModeConfiguration({
  //   ...window.monaco.languages.typescript.typescriptDefaults.modeConfiguration,
  //   diagnostics: false,
  // });
  // window.monaco.languages.json.jsonDefaults.setModeConfiguration({
  //   ...window.monaco.languages.json.jsonDefaults.modeConfiguration,
  //   tokens: false,
  // });
}

const loadMonaco = async () => {
  if (status === Status.LOADED) return;

  if (status === Status.PEDDING) {
    return new Promise((resolve, reject) => {
      event.on('loaded', () => {
        resolve('');
      });
      event.on('fail', (err) => {
        reject(err);
      });
    });
  }

  status = Status.PEDDING;
  const config = getConfig();

  try {
    await injectMonacoLoader();

    await loadEditor();

    if (config.removePresetLanguageConfig) {
      removePresetLanguageProvider();
    }

    setTypescriptConfig();

    if (config.useTextmate) {
      const languageProvider = new LanguageProvider({
        monaco: window.monaco,
        wasm: config.wasm,
        grammars: config.grammars,
      });
      await languageProvider.loadRegistry();

      themeProvider = new ThemeProvider({
        monaco: window.monaco,
        registry: languageProvider.getRegistry(),
        themes: config.themes,
      });
    }

    // themeProvider.setTheme(config.theme);

    status = Status.LOADED;

    event.emit('loaded');
  } catch (error: any) {
    event.emit('fail', error);
    throw new Error(error);
  }
};

const create = async (
  container: HTMLElement,
  options: monaco.editor.IStandaloneEditorConstructionOptions
): Promise<monaco.editor.IStandaloneCodeEditor> => {
  if (status !== Status.LOADED) {
    await loadMonaco();
  }

  // themeProvider.setTheme(options.theme);

  const editor = window.monaco.editor.create(container, options);
  return editor;
};

export { create, loadMonaco };
