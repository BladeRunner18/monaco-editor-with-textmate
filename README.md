# `monaco-editor-with-textmate`

This gets TextMate grammars working in standalone Monaco by leveraging `vscode-oniguruma` and `vscode-textmate.` For more context

## Install

yarn add monaco-editor-with-textmate

## Usage

```js
import MonacoProvider from 'monaco-editor-with-textmate';

const instance = new MonacoProvider();

await instance.loadMonaco({
  language: 'typescript',
  value: 'export default {}',
});

// get editor instance
const editor = instance.getEditor();

// get monaco instance
const monaco = instance.getMonaco();

// get editor element
const element = instance.getEditorElement();

// render to html
document.getElementById('container')?.appendChild(element);
```

## Documents

read the type definition from index.d.ts;
