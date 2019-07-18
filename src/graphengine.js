import { Defaults } from "./defaults";
import { FindInfo } from "./helpers/supportedInfo";

/**
 * @name GraphEngine
 * @extends HTMLElement
 * @description
 * Base graph
 */
export class GraphEngine extends HTMLElement {


    constructor() {
        super();
    }

    /**
     * @name connectedCallback
     * @description
     * Call back for when the component is attached to the DOM
     */
    connectedCallback() {
        this.defaults = {};
        var defaults = new Defaults();

        this.defaults.margin = this.dataset.margin || defaults.margin;
        this.defaults.height = (this.dataset.height || defaults.graphHeight) - this.defaults.margin.top - this.defaults.margin.bottom;
        this.defaults.width = (this.dataset.width || defaults.graphWidth) - this.defaults.margin.left - this.defaults.margin.right;
        this.defaults.lineColor = this.dataset.lineColor || defaults.lineColor;
        this.defaults.unit = this.dataset.unit;

        this.render();
    }

    /**
     * @name parseData
     * @param {Object} data
     * @description
     * Parses data into an array while converting stripping the
     * measurement key
*/
    parseData(data, keyValue) {
        data = JSON.parse(data);
        let results = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var itemPush = {
                time: item.time,
                value: item[keyValue]
            };
         results.push(itemPush);
        }
        return results;
    }


    /**
     * @name render
     * @description
     * Kicks off the render process after attribute value has been set & connectedcallback has run.
     * @param {string} data this param is collected from the data-graph attribute
     */
    render () {
        if (this.graphData && this.defaults) {
            this.innerHTML = "<line-graph data-margin=" + JSON.stringify(this.defaults.margin) +
            " data-height=" + this.defaults.height +
            " data-width=" + this.defaults.width +
            " data-graph=" + JSON.stringify(this.graphData) +
            " data-unit=" + (this.graphInfo.unit || this.defaults.unit) +
            " data-line-color=" + this.defaults.lineColor + "></lineGraph>";
          }
    }

    /**
     * @name dataPoints
     * @description Sets datapoints this.graphdata
     * @param {string} data This param is stringified JSON data setting
     */
    dataPoints(data){
        this.graphInfo = new FindInfo().info(this.dataset.type);
        this.graphData = this.parseData(data, this.graphInfo.key);
    }

    /**
     * @name disconnectedCallback
     * @description
     * Call back for when the component is detached from the DOM
     */
    disconnectedCallback() {}

    /**
     * @name observedAttributes
     * @description Sets what attributes this component will listen for.
     * @returns {Array} an array of attribute to watch for value changes
     */
    static get observedAttributes() {
        return ['data-graph'];
    }

    /**
     * @name attributeChangedCallback
     * @description This callback is fired when attribute values change for
     * @param {string} name attribute name
     * @param {any} oldValue original value upon page load, will most of the time be blank
     * @param {any} newValue new value bound to the attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && name === "data-graph") {
            this.dataPoints(newValue);
            this.render();
        }
    }
}

customElements.define('hedwig-graph', GraphEngine);