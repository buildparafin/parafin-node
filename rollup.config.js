import ts from 'rollup-plugin-ts'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      ts(),
      json(),
      resolve(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js', '.json']
      }),
      commonjs(),
    ]
  }
]
