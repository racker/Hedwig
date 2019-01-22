const kill = require('kill-port');

var stopServer = {};

stopServer.stop = (host, port) => {
    kill(port).then(() => {
        console.log(`server stopped 🛑 on ${host}:${port}`);
    }).catch(() => {
        console.log(`kill port failed - ☹️`);
    });
};

module.exports = stopServer;
