import * as d3 from 'd3';
import { AxisLeft } from './helpers/axisConverter';

/**
 * @name LineGraph
 * @description
 * @extends HTMLElement
 * Generic line graph component for reusability
 */
export class LineGraph extends HTMLElement {

  constructor() {
    super();
    this.lineColor = []; 
  }

  /**
   * @name connectedCallback
   * @description
   * Call back for when the component is attached to the DOM
   */
  connectedCallback() {
    let id = 'hedwig-' + btoa(Math.random()).substr(5, 5);
    this.innerHTML = `<svg id='${id}'></svg>`;
    var svg = document.querySelector(`#${id}`);
    var data = JSON.parse(this.dataset.graph);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(svg);
    this.renderGraph(this.parseData(data), svg);
  }

  /**
   * @name parseData
   * @param {Array} data
   * @description
   * Parses data into an array and converts dates into
   * javascript date objects which is required for d3js
   */
  parseData(data) {
    let uniqueGroups = [];
    let grouping = this.dataset.group;
    data.map((item) => {
      // if grouping is specified find unique groups
      let group = item[grouping];
      const index = uniqueGroups.findIndex((i) => i === group);
      if (index === -1) {
        uniqueGroups.push(group);
      }
    });

    this.getDataLineColor(this.dataset.lineColor);
    // now that we have grouping we will filter and map our datapoints
    return uniqueGroups.map((group) => {
      return {
        group,
        datapoints: data.filter(d => d[grouping] === group).map((d) => {
          return { time: new Date(d.time), value: +d.mean }
        })
      }
    });

   
  }

  /**
   * @name getDataLineColor
   * @description // create function to return random color array for each line.
   */

  getDataLineColor(colors) {
    var arr = [];
    var arrColor;    
    colors.split(',').map(value => arr.push(value));
    arrColor = [...arr, ...d3.schemeCategory10];
    this.lineColor.push.apply(this.lineColor, arrColor);   
  }
 
  /**
   * @name disconnectedCallback
   * @description
   * Call back for when the component is detached from the DOM
   */
  disconnectedCallback() { }

  /**
   * @name renderGraph
   * @param {Array} data
   * @param {innerHTML} el
   * @description
   * Renders the graph using d3js
   */
  renderGraph(data, el) {
    // Setup the margins and height, width
    var margin = JSON.parse(this.dataset.margin);
    var height = parseInt(this.dataset.height);
    var width = parseInt(this.dataset.width);
    var unit = this.dataset.unit;

    // Create X time scale
    var xScale = d3.scaleTime()
      .domain(d3.extent(data[0].datapoints, d => d.time))
      .range([0, width - margin.bottom]);

    // Create Y linear scale
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data[0].datapoints, d => d.value)])
      .range([height - margin.left, 0]);
    // create color scale for each line
    const colorScale = d3.scaleOrdinal(this.lineColor); 
    // Setup the svg element in the DOM
    var svg = d3.select(el)
      .style("width", width + margin.left + +margin.right)
      .style("height", height + +margin.top + +margin.bottom)
      .append('g')
      .attr("transform", `translate(${margin.top}, ${margin.left})`);


    // Create the lines
    var line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value));

      colorScale.domain(data.map(d => d.group)); 
    // add element for line and add class name
    let lines = svg.append('g')
      .attr('class', 'lines');

    // add the lines for each collection of objects to the SVG
    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.datapoints))
      .style('stroke', d => colorScale(d.group))
      .style('fill', 'none');
    /*
    TODO: Color schema strategy needed to ensure lines
    are the right colors
    https://github.com/d3/d3-scale/blob/master/README.md#sequential-scales
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    .style('stroke', (d, i) => color(i));
    */

    // Configure X Axis ticks and add xScale
    var xAxis = d3.axisBottom(xScale).ticks(5);
    // Configure Y Axis ticks and
    var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => {
      return new AxisLeft().convert(unit, d);
    });

    // Add both Axis' to the SVG
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height - margin.top})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000");
  }
}

customElements.define('line-graph', LineGraph);
