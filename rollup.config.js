import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import cssnao from 'cssnano'

import pack from './package.json'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: path.join(__dirname, 'components/index.ts'),
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        name: pack.name
      }
    ],
    plugins: [
      resolve(),
      commonjs({ include: /node_modules/ }),
      postcss({
        plugins: [cssnao()],
        extensions: ['.css', '.less'],
        extract: 'index.css'
      }),
      babel({
        exclude: '/node_modules/**',
        babelHelpers: 'runtime',
        plugins: ['@babel/plugin-transform-runtime']
      }),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      production && terser()
    ],
    external: ['react', 'react-dom']
  }
]
