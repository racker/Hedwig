const glob = require('glob-promise');
const backstop = require('backstopjs');
var args = require('minimist')(process.argv.slice(2));
const componentPath = './src/components';

const projectConfig = (scenarios) => {
    return require("./test/backstop.config.js")({"scenarios": scenarios});
 };

let commandToRun = "";

if( args.reference ) {
    commandToRun = "reference";
}

if( args.test ) {
    commandToRun = "test";
}

if( args.openReport ) {
    commandToRun = "openReport";
}

function getScenariosForProject(projectPath) {
    return new Promise((resolve, reject) => {
        var promises = [];
        glob(projectPath + '/**/*.spec.js').then((files) => {
            files.forEach((element) => {
                var scenario = require(element);
                promises.push(scenario.config);
            });
            resolve(promises);
        });
    });
}

getScenariosForProject(componentPath).then((scenarios) => {
    if( "" !== commandToRun ) {
        backstop(commandToRun, { config: projectConfig(scenarios) });
    }
});
