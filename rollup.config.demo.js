import babel from 'rollup-plugin-babel';

export default {
	moduleName: 'demo',
	entry: 'dist/hypertext.js',
	plugins: [babel({
		"presets": ["es2015-rollup"]
	})],
	format: 'umd',
	dest: 'dist/hypertext-not-for-production.min.js'
};
