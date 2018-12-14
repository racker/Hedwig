import { Defaults } from "../../defaults";

/**
 * @name IrqAverage
 * @description
 * @extends HTMLElement
 * Graph representing average cpu IRQ percent over time
 */
export class IrqAverage extends HTMLElement {
 
    constructor() {
        super();
    }

    /**
     * @name connectedCallback
     * @description
     * Call back for when the component is attached to the DOM
     */
    connectedCallback() {
        var defaults = new Defaults();
        var margin = this.dataset.margin || defaults.margin;
        var height = (this.dataset.height || defaults.graphHeight) - margin.top - margin.bottom;
        var width = (this.dataset.width || defaults.graphWidth) - margin.left - margin.right;
        var lineColor = this.dataset.lineColor || defaults.lineColor;

        this.innerHTML = "<line-graph data-margin=" + JSON.stringify(margin) + 
            " data-height=" + height + 
            " data-width=" + width + 
            " data-graph=" + this.dataset.graph + 
            " data-line-color=" + lineColor + 
            "></lineGraph>";
    }

    /**
     * @name disconnectedCallback
     * @description
     * Call back for when the component is detached from the DOM
     */
    disconnectedCallback() {}
}

customElements.define('cpu-irq-average', IrqAverage);