import babel from 'rollup-plugin-babel';

export default {
    moduleName: 'hypertext',
    entry: 'src/index.js',
    plugins: [babel()],
    format: 'umd',
    dest: 'dist/hypertext.js'
};
