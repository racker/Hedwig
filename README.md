# hedwig-monitoring-library

This repo contains a library that can be used in accordance with [Rackspace Monitoring](https://developer.rackspace.com/docs/rackspace-monitoring/v1/api-reference/) for gathering and displaying metrics data.

## Getting started

Install its dependencies:

```bash
npm install
```

`npm run build` builds the library to `dist`, generating three files:

* `dist/hedwig-main.cjs.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
* `dist/hedwig-main.esm.js`
* `dist/hedwig-main.umd.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. This corresponds to the `"browser"` field in package.json
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json

`npm test` builds the library, then tests it.

## Additional Dependecies

* [babel](https://github.com/rollup/rollup-starter-lib/tree/babel) — illustrates writing the source code in ES2015 and transpiling it for older environments with [Babel](https://babeljs.io/)
* [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel) -
Seamless integration between Rollup and Babel.
* [jsdoc](https://github.com/jsdoc3/jsdoc) — JSDoc 3 is an API documentation generator for Javascript, we will use this to document our libary structure.



## License

[MIT](LICENSE).
