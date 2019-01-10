var scenarioConfig = {};

scenarioConfig.config = (host, port) =>
{
    return {
        "label": `Filesystem - Free Files`,
        "url": `${host}:${port}/filesystem/filesystem-free-files/index.html`,
        "referenceUrl": ``,
        "readyEvent": ``,
        "readySelector": ``,
        "delay": 0,
        "hideSelectors": [],
        "removeSelectors": [],
        "hoverSelector": ``,
        "clickSelector": ``,
        "postInteractionWait": 0,
        "selectors": [ ],
        "selectorExpansion": true,
        "expect": 0,
        "misMatchThreshold" : 0.1,
        "requireSameDimensions": true
    };
};

module.exports = scenarioConfig;