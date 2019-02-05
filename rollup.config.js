import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

let babelPlugin = babel({
	exclude: [
		'node_modules/**/*',
		'*.json'
	]
});

export default [
	// browser-friendly UMD build
	{
		input: 'index.js',
		output: {
			name: 'hedwig-main',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			json(),
			resolve(), // so Rollup can find any dependecies
			commonjs(), // so Rollup can convert any dependencies to an ES module
			babelPlugin
		]
	},
	{
		input: 'index.js',
		output: {
			name: 'hedwig-docs',
			file: pkg.docs,
			format: 'umd'
		},
		plugins: [
			json(),
			resolve(), // so Rollup can find any dependecies
			commonjs(), // so Rollup can convert any dependencies to an ES module
			babelPlugin
		]
	},
	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'index.js',
		external: [], // add all dependecies to this array
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			json()
		]
	}
];
