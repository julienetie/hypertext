// ES5 UMD build with assembly function only.
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    moduleName: 'hypertext',
    entry: './src/exports.js',
    plugins: [
        babel({
            babelrc: false,
            exclude: './node_modules/**',
            presets: 'es2015-rollup'
        }),
        nodeResolve({
            jsnext: true,
            main: true
        })
    ],
    format: 'umd',
    dest: './dist/hypertext.js'
};
