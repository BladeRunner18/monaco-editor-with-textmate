import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'es',
        format: 'es',
      },
      {
        dir: 'lib',
        format: 'commonjs',
      },
    ],
    plugins: [
      clear({ targets: ['lib', 'es', 'dist'] }),
      alias({
        entries: {
          '@': path.resolve(__dirname, 'src'),
        },
      }),
      commonjs(),
      resolve({
        extensions: ['.ts', '.mjs', '.js', '.json', '.node', '.tsx'],
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts', '.mjs', '.tsx'],
        exclude: 'node_modules/**',
      }),
    ],
    external: ['monaco-editor', 'onigasm', 'vscode-textmate', 'vscode-oniguruma', 'react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'es/index.d.ts', format: 'es' }],
    plugins: [
      alias({
        entries: {
          '@': path.resolve(__dirname, 'src'),
        },
      }),
      dts(),
    ],
  },
];
