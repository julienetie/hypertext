import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/globals.js',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: 'es2015-rollup'
        }),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        uglify()
    ],
    targets: [{
        format: 'iife',
        dest: 'dist/hypertext-not-for-production.min.js'
    }, ]
};