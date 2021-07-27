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
        this.defaults = new Defaults();
    }

    /**
     * @name connectedCallback
     * @description
     * Call back for when the component is attached to the DOM
     */
    connectedCallback() {
        this.defaults.margin = this.dataset.margin || this.defaults.margin;
        this.defaults.height = (this.dataset.height || this.defaults.height) - this.defaults.margin.top - this.defaults.margin.bottom;
        this.defaults.width = (this.dataset.width || this.defaults.width) - this.defaults.margin.left - this.defaults.margin.right;
        this.defaults.lineColor = this.dataset.lineColor || this.defaults.lineColor;
        this.defaults.unit = this.dataset.unit;

        this.render();
        this.addEventListener('areaSelected', (v) => {this.graphAreaSelection(v.detail)});
    }

    /**
     * @name render
     * @description
     * Kicks off the render process after attribute value has been set & connectedcallback has run.
     * @param {string} data this param is collected from the data-graph attribute
     */
    render () {
        if (this.graphData) {
            this.innerHTML = "<line-graph data-margin=" + JSON.stringify(this.defaults.margin) +
            " data-height=" + this.defaults.height +
            " data-width=" + this.defaults.width +
            " data-graph=" + this.graphData +
            " data-unit=" + (this.graphInfo) +
            " data-line-color=" + this.defaults.lineColor +
            " data-field=" + this.dataset.field +
            " data-title=" + JSON.stringify(this.dataset.title)+
            " data-group=" + this.dataset.group + "></lineGraph>";
        }
    }

    graphAreaSelection(event) {
        if(event)
        this.dispatchEvent(new CustomEvent("timeStampSelection", {
            bubbles: true,
            composed: true,
            detail: event
          }));
      }
    /**
     * @name resize
     * @param {}
     * @description setup default height & width - resize, change unit
     */
    resize(object) {

        if (object.hasOwnProperty('width')) {
            this.defaults.width = object.width;
        }

        if (object.hasOwnProperty('height')) {
            this.defaults.height = object.height;
        }

        if (object.hasOwnProperty('margin')) {
            this.defaults.margin = object.margin;
        }

        this.render();
    }


    /**
     * @name dataPoints
     * @description Sets datapoints this.graphdata
     * @param {string} data This param is stringified JSON data setting
     */
    dataPoints(data){
        this.graphInfo = new FindInfo().configureUnits(this.dataset.unit);
        this.graphData = data.replace(/\s/g, '-');
        this.resize({});
    }

    /**
     * @name disconnectedCallback
     * @description
     * Call back for when the component is detached from the DOM
     */
    disconnectedCallback() {   }

    /**
     * @name observedAttributes
     * @description Sets what attributes this component will listen for.
     * @returns {Array} an array of attribute to watch for value changes
     */
    static get observedAttributes() {
        return [
            'data-width',
            'data-height',
            'data-graph',
            'data-margin'
        ];
    }

    /**
     * @name attributeChangedCallback
     * @description This callback is fired when attribute values change for
     * @param {string} name attribute name
     * @param {any} oldValue original value upon page loadstomize the , will most of the time be blank
     * @param {any} newValue new value bound to the attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch(!!newValue) {
            case name === "data-graph":
                return this.dataPoints(newValue);
            case name === "data-width":
                return this.resize({width: newValue})
            case name === "data-height":
                return this.resize({height: newValue});
            case name === "data-margin":
                return this.resize({margin: newValue});
        }
    }
}

customElements.define('hedwig-graph', GraphEngine);
