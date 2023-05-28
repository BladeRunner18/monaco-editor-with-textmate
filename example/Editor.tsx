import React from 'react';
import { Editor } from 'monaco-editor-with-textmate';

function App({ value }) {
  return (
    <Editor
      onChange={(v) => {
        console.log(v);
      }}
      options={{ language: 'typescript', theme: 'vs-dark' }}
      value={value}
      height="500px"
    />
  );
}

export default App;
