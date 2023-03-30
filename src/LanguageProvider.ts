import { INITIAL, Registry, parseRawGrammar, StackElement } from 'vscode-textmate';
// import { loadWASM, OnigScanner, OnigString } from 'onigasm';
import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma';
import { PresetGrammars } from './constant';
import { IGrammar } from '@/types';
import http from './util/http';

import { M, monaco } from '@/types';

interface Cfg {
  monaco: M;
  wasm: string;
  grammars?: Record<string, IGrammar>;
}

let isLoadedWASM = false;

export type LanguageInfo = {
  tokensProvider: monaco.languages.EncodedTokensProvider | null;
  configuration: monaco.languages.LanguageConfiguration | null;
};

class LanguageProvider {
  private monaco: M;
  private wasm: string;
  private registry!: Registry;
  private grammars: Record<string, IGrammar>;
  private disposes: monaco.IDisposable[] = [];

  constructor(cfg: Cfg) {
    this.monaco = cfg.monaco;
    this.wasm = cfg.wasm;
    this.grammars = {
      ...PresetGrammars,
      ...cfg.grammars,
    };
  }

  public getRegistry() {
    return this.registry;
  }

  public bindLanguage() {
    for (const [languageId] of Object.entries(this.grammars)) {
      const item = this.grammars[languageId];
      if (item.extra) {
        this.monaco.languages.register(item.extra);
      }
      const dispose = this.monaco.languages.onLanguage(languageId, async () => {
        await this.registerLanguage(languageId);
      });
      this.disposes.push(dispose);
    }
  }

  public async loadRegistry() {
    if (!isLoadedWASM) {
      await loadWASM(await this.loadVSCodeOnigurumWASM());
      isLoadedWASM = true;
    }
    const registry = new Registry({
      onigLib: Promise.resolve({
        createOnigScanner,
        createOnigString,
        // createOnigScanner: (patterns: any) => {
        //   return new OnigScanner(patterns);
        // },
        // createOnigString: (s: any) => {
        //   return new OnigString(s);
        // },
      }),
      loadGrammar: async (scopeName) => {
        const key = Object.keys(this.grammars).find((k) => this.grammars[k].scopeName === scopeName);
        const grammar = this.grammars[key as keyof typeof this.grammars];
        if (grammar) {
          const res = await http(`${grammar.tm}`);
          const type = grammar.tm.substring(grammar.tm.lastIndexOf('.') + 1);
          return parseRawGrammar(res, `example.${type}`);
        }
        return Promise.resolve(null);
      },
    });

    this.registry = registry;

    this.bindLanguage();
  }

  public async registerLanguage(languageId: string) {
    const { tokensProvider, configuration } = await this.fetchLanguageInfo(languageId);

    if (configuration !== null) {
      this.monaco.languages.setLanguageConfiguration(languageId, configuration);
    }

    if (tokensProvider !== null) {
      this.monaco.languages.setTokensProvider(languageId, tokensProvider);
    }
  }

  public async fetchLanguageInfo(languageId: string): Promise<LanguageInfo> {
    const [configuration, tokensProvider] = await Promise.all([
      this.getConfiguration(languageId),
      this.getTokensProvider(languageId),
    ]);

    return { configuration, tokensProvider };
  }

  // 获取语法配置JSON文件
  public async getConfiguration(languageId: string): Promise<monaco.languages.LanguageConfiguration | null> {
    const grammar = this.grammars[languageId];
    if (grammar.cfg) {
      const res = await http(`${grammar.cfg}`);
      return JSON.parse(res);
    }
    return Promise.resolve(null);
  }

  // 获取TextMate配置JSON文件
  public async getTokensProvider(languageId: string): Promise<monaco.languages.EncodedTokensProvider | null> {
    const scopeName = this.getScopeNameFromLanguageId(languageId);
    const grammar = await this.registry.loadGrammar(scopeName);

    if (!grammar) return null;

    return {
      getInitialState() {
        return INITIAL;
      },
      tokenizeEncoded(line: string, state: monaco.languages.IState): monaco.languages.IEncodedLineTokens {
        const tokenizeLineResult2 = grammar.tokenizeLine2(line, state as StackElement);
        const { tokens, ruleStack: endState } = tokenizeLineResult2;
        return { tokens, endState };
      },
    };
  }

  public getScopeNameFromLanguageId(languageId: string) {
    for (const [key, value] of Object.entries(this.grammars)) {
      if (key === languageId) {
        return value.scopeName;
      }
    }
    throw new Error(`can not find scopeName with languageId: ${languageId}`);
  }

  public async loadVSCodeOnigurumWASM() {
    const response = await fetch(this.wasm);
    const contentType = response.headers.get('content-type');
    if (contentType === 'application/wasm') {
      return response;
    }
    // Using the response directly only works if the server sets the MIME type 'application/wasm'.
    // Otherwise, a TypeError is thrown when using the streaming compiler.
    // We therefore use the non-streaming compiler :(.
    return await response.arrayBuffer();
  }

  public dispose() {
    this.disposes.forEach((d) => d.dispose());
    this.registry?.dispose();
  }
}

export default LanguageProvider;
