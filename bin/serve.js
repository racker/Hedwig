#!/usr/bin/env node
'use strict';
const CONFIG = require('../_config');
const path = require('path');
const express = require('express');

// Create Express App
const app = express();
app.use('/hedwig', express.static(CONFIG.srcComponents));
app.use('/', express.static(CONFIG.srcComponents));
app.use('/dist', express.static(CONFIG.distDir));

// Start Server
const server = app.listen(4700, () => {
    console.log('🚀 serving at http://127.0.0.1:4700');
});
