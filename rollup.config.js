import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'es',
      },
      {
        dir: 'dist/cjs',
        format: 'commonjs',
      },
    ],
    plugins: [
      clear({ targets: ['dist'] }),
      alias({
        entries: {
          '@': path.resolve(__dirname, 'src'),
        },
      }),
      resolve({
        extensions: ['.ts', '.mjs', '.js', '.json', '.node'],
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts', '.mjs'],
      }),
    ],
    external: ['monaco-editor', 'onigasm', 'vscode-textmate'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
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
