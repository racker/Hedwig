const kill = require('kill-port');
const CONFIG = require('../_config');

kill(CONFIG.port).then(() => {
    console.log(`server stopped 🛑 on ${CONFIG.host}:${CONFIG.port}`);
}).catch(() => {
    console.log(`kill port failed - ☹️`);
});