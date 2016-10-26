import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    moduleName: 'hypertext',
    entry: 'src/demo.js',
    plugins: [
        babel({
            babelrc: false,
            presets: 'es2015-rollup'
        }),
        nodeResolve({
            jsnext: true,
            main: true
        })
    ],
    format: 'iife',
    dest: 'demo/dist/hypertext-not-for-production.min.js'
};
