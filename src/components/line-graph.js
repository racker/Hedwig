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
        var svg = document.querySelector('svg');
        var data = JSON.parse(this.dataset.graph);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(svg);
        this.renderGraph(this.parseData(data), svg);
    }

    /**
     * @name parseData
     * @param {Object} data
     * @description
     * Parses data so that dates are javascript date objects
     * which is required for d3js
     */
    parseData(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].time = new Date(data[i].time);
        }
        return data;
    }

    /**
     * @name disconnectedCallback
     * @description
     * Call back for when the component is detached from the DOM
     */
    disconnectedCallback() {}

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
                        return d;
                    case unit === 'b':
                        return d + ' b';
                    case unit === 'kb':
                        return d + ' kb';
                    case unit === 'mb':
                        return d + ' mb';
                    case unit === 'frames':
                        return d + ' frames/s';
                    case unit === 'overruns':
                        return d + ' overruns/s';
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
