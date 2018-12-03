import * as d3 from 'd3';

/**
 * @name CpuMaxUsage
 * @description
 * POC component for proving interopt between Hedwig and Minerva
 */
export class CpuMaxUsage extends HTMLElement {

    constructor() {
        super();
    }

    /**
     * @name connectedCallback
     * @description
     * Call back for when the component is attached to the DOM
     */
    connectedCallback() {
        this.innerHTML = "<svg></svg>";

        // Setup the margins and height, width
        this.margin = { top: 30, right: 20, bottom: 30, left: 50 };
        this.height = 200 - this.margin.top - this.margin.bottom;
        this.width = 600 - this.margin.left - this.margin.right;

        this.dataMarshaller()
            .svgSetup()
            .axisSetup();
    }

    /**
     * @name disconnectedCallback
     * @description
     * Call back for when the component is detached from the DOM
     */
    disconnectedCallback() {}

    /**
     * @name svgSetup
     * @description
     * Setups the SVG element for use with d3js
     */
    svgSetup () {
        // Setup the svg element in the DOM
        this.svg = d3.select('svg')
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // Create the path to the line in the svg element
        this.svg.append('path')
        .attr('d', this.calculateLine()(this.marshalledData))
        .attr('class', 'line')
        .style('stroke-width', 2)
        .style('stroke', 'orange')
        .style('fill', 'none');
        
        return this;
    }

    /**
     * @name axisSetup
     * @description
     * Sets up the X and Y axis for the graph rendered in this component
     */
    axisSetup () {
        // Scale the graph to the dimensions of the svg
        var chartProps = {};
        chartProps['x'] = d3.scaleLinear().range([0, this.width]);
        chartProps['y'] = d3.scaleLinear().range([this.height, 0]);

        var xAxis = d3.axisBottom(chartProps['x']);
        var yAxis = d3.axisLeft(chartProps['y']);
        
        // Add the X Axis
        this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis);

        // Add the Y Axis
        this.svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        return this;
    }

    /**
     * @name dataMarshaller
     * @description
     * Marshalls the data before being rendered in the graph
     */
    dataMarshaller () {
        var value = this.attributes.getNamedItem('data').value;
        var data = JSON.parse(value);
        this.marshalledData = [];

        for (let index in data[0].valuesCollection) {
            this.marshalledData.push({ time: data[0].valuesCollection[index][0], cpu_max_usage: data[0].valuesCollection[index][8] });
        }

        return this
    }

    /**
     * @name calculateLine
     * @description
     * Creates the line used in the graph for this component
     */
    calculateLine () {
        // Create the line
        return d3.line()
        .y(function(data, index){
            return data.cpu_max_usage;
        })
        .x(function(data, index){
            return index * 10;
        })
    }
}

customElements.define('cpu-max-usage', CpuMaxUsage);

