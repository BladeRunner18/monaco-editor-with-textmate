interface Window {
  require: {
    config: (...arg: any) => any;
  } & ((...arg: any) => any);
  monaco: monaco;
}

declare module 'vscode-oniguruma';
