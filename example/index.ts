import { loadMonaco, create } from 'monaco-editor-with-textmate';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Editor';

const value = `
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

`;

// const div = document.createElement('div');

// div.style.width = '100%';
// div.style.height = '500px';

// document.body.append(div);

// const editor = await create(div, {
//   value,
//   language: 'typescript',
// });

ReactDOM.render(React.createElement(App, { value }), document.getElementById('container'));
