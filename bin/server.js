#!/usr/bin/env node
'use strict';
const CONFIG = require('../_config');
const express = require('express');

// Create Express App
const app = express();
app.use('/', express.static(CONFIG.demoComponents));
app.use('/dist', express.static(CONFIG.distDir));

let server = {};
let appServer = "";

server.start = () => {
    appServer = app.listen(CONFIG.port, () => {
        console.log(`🚀 serving at ${CONFIG.host}:${CONFIG.port}`);
    });
};

server.stop = () => {
    appServer.close(function() {
        console.log(`server stopped 🛑 on ${CONFIG.host}:${CONFIG.port}`);
        process.exit();
    });
};

module.exports = server;
