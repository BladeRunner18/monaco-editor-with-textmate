# `monaco-editor-with-textmate`

This gets TextMate grammars working in standalone Monaco by leveraging `vscode-oniguruma` and `vscode-textmate.` For more context

## Install

```bash
yarn add monaco-editor-with-textmate
```

## Usage

```tsx
import { create, Editor } from 'monaco-editor-with-textmate';

// create editor
const editor = await create(document.getElementById('container'), {
  value: '{}',
  language: 'json',
});

//react
export default () => {
  return (
    <Editor
      onChange={(v) => {
        console.log(v);
      }}
      options={{ language: 'javascript' }}
      value={value}
      height="500px"
    />
  );
};
```

## Documents

read the type definition from [index.d.ts](https://github.com/BladeRunner18/monaco-editor-with-textmate/blob/master/src/types/index.d.ts);
