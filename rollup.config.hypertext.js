import babel from 'rollup-plugin-babel';

export default {
    moduleName: 'hypertext',
    entry: 'src/index.js',
    plugins: [babel()],
    format: 'es',
    // dest: 'demo/hypertext.js'
    targets: [
    	{
    		format: 'es',
    		dest: 'dist/hypertext.js'
    	},
      	{
    		format: 'cjs',
    		dest: 'dist/hypertext-cjs.js'
    	}
    ]
};
