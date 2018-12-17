import * as d3 from 'd3';

/**
 * @name LineGraph
 * @description
 * @extends HTMLElement
 * Generic line graph component for reusability
 */
export class LineGraph extends HTMLElement {

    constructor() {
        super();
    }

    /**
     * @name connectedCallback
     * @description
     * Call back for when the component is attached to the DOM
     */
    connectedCallback() {

        this.innerHTML = '<svg></svg>';
        var svg = document.querySelector('svg')

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(svg);
        this.renderGraph(this.parseData(this.dataset.graph), svg);
    }

    /**
     * @name disconnectedCallback
     * @description
     * Call back for when the component is detached from the DOM
     */
    disconnectedCallback() {}

    /**
     * @name parseData
     * @param {Object} data
     * @description
     * Parses data into an array while converting time to a proper
     * Javascript date object
     */
    parseData(data) {
        data = JSON.parse(data);
        var results = [];
        for (var i = 0; i < data.length; i++) {
            var item = {};
            var key = Object.keys(data[i])[0];
            item.time = new Date(data[i][key].time);
            item.value = data[i][key].value;
            results.push(item);
        }
        return results;
    }

    /**
     * @name renderGraph
     * @param {Object} data
     * @description
     * Renders the graph using d3js
     */
    renderGraph(data, el) {

        // Setup the margins and height, width
        var margin = JSON.parse(this.dataset.margin);
        var height = this.dataset.height;
        var width = this.dataset.width;
        var unit = this.dataset.unit;

        // Setup the svg element in the DOM
        var svg = d3.select(el)
            .style("width", parseInt(width) + parseInt(margin.left) + parseInt(margin.right))
            .style("height", parseInt(height) + parseInt(margin.top) + parseInt(margin.bottom))
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // Create X time scale
        var xScale = d3.scaleTime()
            .domain([data[0].time, data[data.length - 1].time])
            .range([0, width]);

        // Create Y linear scale
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) {
                return d.value;
            })])
            .range([height, 0]);

        // Create the line
        var line = d3.line()
            .x((d, i) => {
                return xScale(d.time);
            })
            .y((d) => {
                return yScale(d.value);
            })
            .curve(d3.curveMonotoneX);

        // Add everything to the SVG
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(xScale).ticks(data.length));

       svg.append("g")
           .attr("class", "y axis")
           .call(d3.axisLeft(yScale).ticks(data.length).tickFormat((d) => {
               switch(true) {
                    case unit === 'count':
                        return (d);
                    default:
                    return (d * 100) + '%';
               }
           }));

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style('stroke-width', 2)
            .style('stroke', this.dataset.lineColor)
            .style('fill', 'none');
    }
}

customElements.define('line-graph', LineGraph);