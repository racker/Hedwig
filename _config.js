const path = require('path');
const CONFIG = {};

CONFIG.root = path.resolve(__dirname);// absolute path to project directory
CONFIG.sourceDir = 'src';
CONFIG.srcComponents = CONFIG.sourceDir + '/components';
CONFIG.docsDir = 'docs';
CONFIG.testDir = 'test';
CONFIG.distDir = 'dist';
CONFIG.host = 'http://localhost';
CONFIG.port = '4700'; //configurable port to host local pages


/* Define Exports */
module.exports = CONFIG;
