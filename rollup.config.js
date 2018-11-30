import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-html';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

let babelPlugin = babel({
    exclude: 'node_modules/**/*',
});

let htmlPlugin = html({
    include: [
        '**/*.svg',
        '**/*.html',
    ],
    htmlMinifierOptions: {
        collapseWhitespace: true,
        quoteCharacter: "'", // reduces escape characters
    },
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
			babelPlugin,
			htmlPlugin,
			resolve(), // so Rollup can find any dependecies
			commonjs() // so Rollup can convert any dependencies to an ES module
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
            htmlPlugin
		]
	}
];
