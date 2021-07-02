module.exports = (options) => {
    return {
        "id": "Backstop_Graphs",
        "viewports": [
          {
            "label": "phone",
            "width": 320,
            "height": 480
          },
          {
            "label": "tablet",
            "width": 1024,
            "height": 768
          },
          {
            "label": "desktop",
            "width": 1860,
            "height": 1024
          }
        ],
        /* when attempting to create a test for click events we will make
           use of the onReadyScript  */
        // "onReadyScript": `puppet/onReady.js`,
        "scenarios": options.scenarios,
        "paths": {
            "bitmaps_reference": `test/backstop_data/bitmaps_references`,
            "bitmaps_test": `test/backstop_data/bitmaps_test`,
            "casper_scripts": `test/backstop_data/casper_scripts`,
            "html_report": `test/backstop_data/html_report`,
            "ci_report": `test/backstop_data/ci_report`,
            "engine_scripts": "test/engine_scripts"
        },
        "report": ["browser"],
        "engine": "puppeteer",
        "engineOptions": {
          "args": ["--no-sandbox"]
        },
        "asyncCaptureLimit": 5,
        "asyncCompareLimit": 50,
        "debug": false,
        "debugWindow": false
    };
};