import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'src/globals.js',
    plugins: [
        babel({
      exclude: 'node_modules/**',
      presets: 'es2015-rollup'
    }),
        uglify()
    ],
    targets: [{
        format: 'iife',
        dest: 'dist/hypertext-not-for-production.min.js'
    }, ]
};
