#!/usr/bin/env node
'use strict';
const CONFIG = require('../_config');
const express = require('express');

// Create Express App
const app = express();
app.use('/hedwig', express.static(CONFIG.srcComponents));
app.use('/', express.static(CONFIG.srcComponents));
app.use('/dist', express.static(CONFIG.distDir));

// Start Server
const server = app.listen(CONFIG.port, () => {
    console.log(`🚀 serving at ${CONFIG.host}:${CONFIG.port}`);
});
