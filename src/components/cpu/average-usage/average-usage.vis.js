var scenarioConfig = {};

scenarioConfig.config = (host, port) =>
{
    return {
        "label": `CPU - Count`,
        "url": `${host}:${port}/cpu/average-usage/index.html`,
        "referenceUrl": `hedwig-backstop.mnrva-deploy.dev.monplat.rackspace.net/${process.env.REPO_NAME}/${process.env.BRANCH_NAME}/${process.env.COMMIT_SHA}/`,
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
