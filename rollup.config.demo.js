import babel from 'rollup-plugin-babel';

export default {
    moduleName: 'hypertext',
    entry: 'src/demo.js',
    plugins: [babel()],
    format: 'umd',
    dest: 'demo/app.js'
};