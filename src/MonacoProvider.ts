import LanguageProvider from './LanguageProvider';
import Workbench from './Workbench';
import ThemeProvider from './ThemeProvider';
import type { monaco, M, MonacoProviderOptions } from '@/types';

// default opts
const opts: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: 'vs-dark',
  minimap: {
    enabled: false,
  },
  tabSize: 2,
  lineNumbers: 'on',
  padding: {
    top: 10,
  },
};

const defaultOptions: MonacoProviderOptions = {
  vs: 'https://unpkg.com/monaco-editor@0.36.1/min/vs',
  removePresetLanguageConfig: true,
  theme: 'dracula',
  wasm: 'https://unpkg.com/vscode-oniguruma@1.7.0/release/onig.wasm',
  grammars: {} as any,
  themes: {},
};

class MonacoService {
  private monaco!: M;
  private editor!: monaco.editor.IStandaloneCodeEditor;
  private elements: { editor: HTMLDivElement } = {} as any;
  private languageProvider!: LanguageProvider;
  private workbench!: Workbench;
  private themeProvider!: ThemeProvider;
  private options: MonacoProviderOptions;
  private observers = new ResizeObserver(([elm]) => {
    this.editor?.layout();
  });

  constructor(opts?: Partial<MonacoProviderOptions>) {
    this.options = {
      ...defaultOptions,
      ...(opts || {}),
    };
    this.createElement();
  }

  private createElement() {
    const div = document.createElement('div');
    div.id = 'vscode-editor';
    div.style.width = '100%';
    div.style.height = '100%';
    this.elements.editor = div;

    this.observers.observe(div);

    return div;
  }

  private injectMonacoLoader = async () => {
    if (window.monaco) return;
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${this.options.vs}/loader.js`;
      document.body.appendChild(script);
      script.onload = () => {
        window.require.config({
          paths: { vs: this.options.vs },
        });
        resolve('');
      };

      script.onerror = (err) => {
        console.error('Inject monaco loader failed');
        reject(err);
      };
    });
  };

  public async loadMonaco(options: Partial<monaco.editor.IStandaloneEditorConstructionOptions>) {
    if (this.editor) return;

    await this.injectMonacoLoader();

    const monaco = await new Promise<M>((resolve) => {
      window.require(['vs/editor/editor.main'], (monaco: M) => {
        resolve(monaco);
      });
    });
    this.monaco = monaco;

    // remove preset if you want
    if (this.options.removePresetLanguageConfig) {
      this.removePresetLanguageProvider();
    }

    // preset config
    this.setTypescriptConfig();

    // language service
    this.languageProvider = new LanguageProvider({ monaco, wasm: this.options.wasm });
    await this.languageProvider.loadRegistry();

    // theme service
    this.themeProvider = new ThemeProvider({ monaco, registry: this.languageProvider.getRegistry() });

    const editor = monaco.editor.create(this.elements.editor, { ...opts, ...options });
    this.editor = editor;

    this.themeProvider.setTheme(this.options.theme);

    // workbench service
    this.workbench = new Workbench({ monaco, editor });
    this.workbench.addActions();
  }

  public setTypescriptConfig() {
    this.monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      allowJs: true,
      experimentalDecorators: true,
      jsxFactory: 'React.createElement',
      module: 1,
      jsx: 2,
      noEmit: true,
      moduleResolution: 2,
      target: 2,
    });
    // TODO
    this.monaco.languages.typescript.typescriptDefaults.setModeConfiguration({
      ...this.monaco.languages.typescript.typescriptDefaults.modeConfiguration,
      diagnostics: false,
    });
    this.monaco.languages.json.jsonDefaults.setModeConfiguration({
      ...this.monaco.languages.json.jsonDefaults.modeConfiguration,
      tokens: false,
    });
  }

  public removePresetLanguageProvider() {
    const languages = ['javascript', 'typescript', 'html', 'css', 'json'];
    for (const languageId of languages) {
      this.monaco.languages.registerTokensProviderFactory(languageId, {} as any).dispose();
      this.monaco.languages.onLanguage(languageId, () => {}).dispose();
    }
  }

  public getEditorElement() {
    return this.elements.editor;
  }

  public getEditor() {
    return this.editor;
  }

  public getMonaco() {
    return this.monaco;
  }

  public dispose() {
    this.observers.disconnect();
    this.languageProvider.dispose();
    this.editor.dispose();
  }
}

export default MonacoService;
